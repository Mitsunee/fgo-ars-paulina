import { createPortal } from "preact/compat";
import { useEffect, useState } from "preact/hooks";
import type { ElementRef } from "~/components/jsx";

export function useModalRef(id: string = "modal-dialog") {
  const dialog = document.getElementById(id)! as ElementRef<"dialog">;

  function createDialog(vnode: Parameters<typeof createPortal>[0]) {
    return createPortal(vnode, dialog);
  }

  return [dialog, createDialog] as const;
}

export function useModal(id: string = "modal-dialog") {
  const [rendering, setRendering] = useState(false);
  const [dialog, createPortal] = useModalRef(id);

  function createDialog(vnode: Parameters<typeof createPortal>[0]) {
    return <>{rendering ? createPortal(vnode) : null}</>;
  }

  function showDialog() {
    setRendering(true);
    dialog.showModal();
  }

  useEffect(() => {
    const callback = () => setRendering(false);
    dialog.addEventListener("close", callback);
    return () => dialog.removeEventListener("close", callback);
  }, [dialog]);

  return [dialog, createDialog, showDialog] as const;
}
