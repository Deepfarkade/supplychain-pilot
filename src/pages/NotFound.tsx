import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import NotFoundModal from "@/components/NotFoundModal";

const NotFound = () => {
  const location = useLocation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    setShowModal(true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center surface-0">
      <NotFoundModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Page Not Found"
        message={`The page "${location.pathname}" you're looking for doesn't exist. It may have been moved, deleted, or you may have entered the URL incorrectly.`}
      />
    </div>
  );
};

export default NotFound;
