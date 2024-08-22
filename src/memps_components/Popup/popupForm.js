import { Dialog } from "@mui/material";

export function PopupForm({open, onClose,children, givenKey}) {
    return (
      <Dialog key={givenKey} onClose={()=>onClose()} open={open} style={{backgroundColor: "rgba(0,0,0,0.3)"}} maxWidth="none">
       {children}
      </Dialog>
    )
  }