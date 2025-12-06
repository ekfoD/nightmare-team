import { useEffect } from "react";
import Alert from "react-bootstrap/Alert";

export default function SuccessNotifier({ show, message, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2500); // auto-hide
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <Alert
      variant="success"
      style={{
        position: "fixed",
        bottom: "30px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        minWidth: "380px",
        textAlign: "center",
        fontSize: "1.2rem",
        padding: "15px 25px",
        borderRadius: "10px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
      }}
    >
      {message}
    </Alert>
  );
}
