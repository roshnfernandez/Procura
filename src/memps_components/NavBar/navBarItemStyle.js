function collapseItem(active) {
  
    return {
      background: active
        ? "linear-gradient(#FEC119, #ffc51a)"
        : "rgba(0,0,0,0)",
      color: active? "#1d403c" : "#ffffff",
      width: "100%",
      padding: "8px",
      margin: "1px",
      marginLeft: "15px",
      marginRight: "15px",
      borderRadius: "5px",
      cursor: "pointer",
      userSelect: "none",
      whiteSpace: "nowrap",
      boxShadow: "none",
      "&:hover, &:focus": {
        backgroundColor: () => {
          let backgroundValue;
  
          if (!active) {
            backgroundValue =
            "#676767"
          }
  
          return backgroundValue;
        },
      },
    };
  }
  
  const collapseIcon = ({ active }) => ({
    color: active? "#1d403c" : "#ffffff",
  });
  
  export { collapseItem, collapseIcon };
  