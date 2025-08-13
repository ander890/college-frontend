import React from "react";
import { useRouter } from "next/navigation";

export function BirthDateCell({ value }) {
  if (!value) return <span></span>;
  const d = new Date(value);
  const bulan = d.toLocaleString("id-ID", { month: "long" });
  return <span>{`${d.getDate()} ${bulan.charAt(0).toUpperCase() + bulan.slice(1)} ${d.getFullYear()}`}</span>;
}

export function ActionMenu({ participantId }) {
  const [open, setOpen] = React.useState(false);
  const [menuPos, setMenuPos] = React.useState({ top: 0, left: 0 });
  const btnRef = React.useRef(null);
  const router = useRouter();

  function handleOpen() {
    setOpen((v) => !v);
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({ top: rect.bottom + window.scrollY, left: rect.right + window.scrollX - 128 }); // 128 = menu width
    }
  }

  React.useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (btnRef.current && !btnRef.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        className="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
        onClick={handleOpen}
        aria-label="Aksi"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <circle cx="10" cy="4" r="1.5" fill="#888" />
          <circle cx="10" cy="10" r="1.5" fill="#888" />
          <circle cx="10" cy="16" r="1.5" fill="#888" />
        </svg>
      </button>
      {open && (
        <div
          className="fixed z-50 w-32 origin-top-right rounded-md bg-white border border-gray-200 shadow-lg"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          <button
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              console.log('Edit participantId:', participantId, typeof participantId);
              if (participantId !== undefined && participantId !== null && participantId !== '') {
                const url = `/admin/participants/${String(participantId)}/edit`;
                try {
                  router.push(url);
                  setTimeout(() => {
                    if (window.location.pathname !== url) {
                      console.error('router.push did not navigate, fallback to window.location:', url);
                      window.location.href = url;
                    }
                  }, 500);
                } catch (err) {
                  console.error('router.push error:', err);
                  window.location.href = url;
                }
              } else {
                alert('ID peserta tidak valid: ' + participantId);
              }
            }}
          >
            Edit
          </button>
          <button
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100"
            onClick={() => {
              setOpen(false);
              // TODO: handle delete
              alert('Fitur delete belum diimplementasikan');
            }}
          >
            Delete
          </button>
        </div>
      )}
    </>
  );
}
