import { useState, useContext, useEffect } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navigation from "../navigation/Navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Grid from "@mui/material/Grid2";
import { AuthContext } from "../../context/AuthContext";
import Collapse from "@mui/material/Collapse";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import RefreshToken from "../../services/RefreshToken";
import { handlePostData } from "../../services/PostDataService";
import { getDataWithToken } from "../../services/GetDataService";
import SettingsSuggestOutlinedIcon from "@mui/icons-material/SettingsSuggestOutlined";

const drawerWidth = 270;

const openedMixin = (theme) => ({
  width: drawerWidth,

  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(11)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(11)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.light,
    maxWidth: 500,
    // boxShadow: theme.shadows[1],
    fontSize: 14,
    border: "1px solid #E6E8ED",
    padding: "16px",
    background: theme.palette.primary.main,
    // borderRadius:"8px"
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
    {
      marginLeft: "0px",
    },
  [`& .MuiTooltip-arrow`]: {
    // fontSize: 20,
    // color: "#4A4A4A",
    "&::before": {
      backgroundColor: theme.palette.primary.main,
      border: "1px solid #E6E8ED",
    },
  },
}));
const LightMenuTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.light,
    // boxShadow: theme.shadows[1],
    fontSize: 14,
    border: "1px solid #E6E8ED",
    padding: "16px",
    // background: theme.palette.primary.main,
    // borderRadius:"8px"
  },
  [`&.${tooltipClasses.popper}[data-popper-placement*="right"] .${tooltipClasses.tooltip}`]:
    {
      marginLeft: "0px",
    },
  // [`& .MuiTooltip-arrow`]: {
  //   // fontSize: 20,
  //   // color: "#4A4A4A",
  //   "&::before": {
  //     backgroundColor: "#fff",
  //     border: "1px solid #E6E8ED",
  //   },
  // },
}));

export default function Layout() {
  const theme = useTheme();
  let navigate = useNavigate();
  let pathname = useLocation().pathname;
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  console.log("pathname", pathname);
  const [signOutLoading, setSignOutLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [openMenu, setOpenMenu] = useState("");
  const [cartsOpen, setCartsOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [notificationCartName, setNotificationCartName] = useState("11");

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleDrawerOpen = (openValue) => {
    setOpen(openValue);
    if (!openValue) {
      setCartsOpen(false);
      setOrderOpen(false);
      setPaymentOpen(false);
      setSettingsOpen(false);
    }
  };
  const handleSnakbarOpen = (msg, vrnt) => {
    let duration;
    if (vrnt === "error") {
      duration = 3000;
    } else {
      duration = 1000;
    }
    enqueueSnackbar(msg, {
      variant: vrnt,
      autoHideDuration: duration,
    });
  };
  const fnLogout = async () => {
    console.log("fnLogout-----------");
    logout();
    try {
      setSignOutLoading(true);

      let url = `/api/v1/auth/logout`;
      let res = await handlePostData(url);
      if (res?.status === 401) {
        logout();
        return;
      }
      if (res.status >= 200 && res.status < 300) {
        setSignOutLoading(false);
        // logout();
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      setSignOutLoading(false);
      handleSnakbarOpen(error.response.data.message.toString(), "error");
    }
    setSignOutLoading(false);
  };

  console.log(
    "ifixit_admin_panel?.permission",
    ifixit_admin_panel?.user?.permission
  );

  const checkPermission = (permissionName) => {
    return ifixit_admin_panel?.user?.permission?.includes(permissionName);
  };
  const checkMultiplePermission = (permissionNames) => {
    return permissionNames.some((item) =>
      ifixit_admin_panel?.user?.permission.includes(item)
    );
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const handleCartOpen = () => {
    if (open) {
      setCartsOpen(!cartsOpen);
    }
  };
  const handleOrderOpen = () => {
    if (open) {
      setOrderOpen(!orderOpen);
    }
  };
  const handleSettingsOpen = () => {
    if (open) {
      setSettingsOpen(!settingsOpen);
    }
  };
  const handlePaymentOpen = () => {
    if (open) {
      setPaymentOpen(!paymentOpen);
    }
  };
  const listButtonStyle = {
    mx: 2,
    mb: 0.5,
    borderRadius: "6px",
    color: "#343E54",
    ["& .MuiTypography-root"]: {
      fontSize: "14px",
      fontWeight: 500,
      color: "#343E54",
    },
    "&:hover": {
      background: "#F9FAFB",
      color: theme.palette.text.main,
      path: {
        stroke: theme.palette.text.main,
      },
      ["& .MuiTypography-root"]: {
        color: theme.palette.text.main,
      },
    },
  };

  const iconStyle = { position: "relative", left: 7 };
  const activeStyle = {
    background: theme.palette.primary.light,
    color: theme.palette.primary.main,
    path: {
      stroke: theme.palette.primary.main,
    },
    ["& .MuiTypography-root"]: {
      color: theme.palette.primary.main,
    },
    "&:hover": {
      background: theme.palette.primary.light,
      color: theme.palette.primary.main,
      ["& .MuiTypography-root"]: {
        color: theme.palette.primary.main,
      },
      path: {
        stroke: theme.palette.primary.main,
      },
    },
    ["&.MuiListItemButton-root"]: {
      // borderRadius: "10px",
      // "& span": {
      //   color: "#fff",
      // },
      // ["& .MuiSvgIcon-root"]: {
      //   color: "#fff",
      // },
    },
  };
  const action = (snackbarId) => (
    <>
      {/* <button
        onClick={() => {
          alert(`I belong to snackbar with id ${snackbarId}`);
        }}
      >
        Undo
      </button> */}
      <IconButton
        onClick={() => {
          closeSnackbar(snackbarId);
        }}
      >
        <ClearOutlinedIcon />
      </IconButton>
    </>
  );
  const handleOpemMenu = (title) => {
    if (openMenu === title) {
      setOpenMenu("");
    } else {
      setOpenMenu(title);
    }
  };
  useEffect(() => {}, []);

  const withoutLayout = ["/", "/forgot-password", "/reset-password", "/otp"];

  if (withoutLayout.includes(pathname)) {
    return <Navigation />;
  } else if (!ifixit_admin_panel.token) {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar> */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              justifyContent: "space-between",
              borderRight: "1px solid #EAECF1",
              boxShadow: "none",
            },
          }}
        >
          {/* <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider /> */}
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, px: 3 }}>
          {/* <DrawerHeader /> */}
          <Navigation />
          {/* <footer
            id="footer"
            style={{
              backgroundColor: "#F8F8F8",
              borderTop: "1px solid #E7E7E7",
              // textAlign: "center",
              padding: "0px 0px 0px 70px",
  
              position: "fixed",
              left: "0",
              bottom: "0",
              // height: "60px",
              width: "100%",
            }}
          >
            <Breadcrumbs
              aria-label="breadcrumb"
              separator="›"
              // className={classes.breadcrumbsStyle}
            >
              <Link to="/projects">Projects</Link>
              <Link to="/projects">International</Link>
  
              <Link to="#">VerifyMe Web</Link>
            </Breadcrumbs>
          </footer> */}
        </Box>
      </Box>
    );
  } else {
    return (
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* <AppBar position="fixed" open={open}>
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Mini variant drawer
            </Typography>
          </Toolbar>
        </AppBar> */}
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              justifyContent: "space-between",
              borderRight: "1px solid #EAECF1",
              boxShadow: "none",
            },
          }}
        >
          {/* <DrawerHeader>
            <IconButton onClick={() => setOpen(!open)}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider /> */}
          <List sx={{ pb: 0 }}>
            <ListItem
              disablePadding
              sx={{
                display: "block",
                // borderBottom: "1px solid #E5E5E5",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  pt: 3,
                  pb: 4,
                  // mb: 2.5,
                }}
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid size="auto" sx={{ position: "relative" }}>
                    <img
                      src="/logo.png"
                      alt="logo"
                      style={{
                        position: "absolute",
                        left: 0,
                        top: -18,
                        // display: "block",
                        // margin: "auto",
                        // width: "24px",
                        // marginBottom: "16px",
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              {/* <Divider sx={{ mb: 2.5 }} /> */}
            </ListItem>
            <Box
              className="sidebar"
              sx={{
                height: "Calc(100vh - 150px)",

                overflowY: "auto",
                pt: 2.5,
              }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleOpemMenu("")}
                  component={Link}
                  to="/dashboard"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/dashboard" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.33325 3.33301H8.33325V9.99967H3.33325V3.33301Z"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M3.33325 13.333H8.33325V16.6663H3.33325V13.333Z"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.6666 9.99967H16.6666V16.6663H11.6666V9.99967Z"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M11.6666 3.33301H16.6666V6.66634H11.6666V3.33301Z"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </ListItem>
              {checkMultiplePermission(["user_list", "user_management"]) && (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      // component={Link}
                      // to="/carts"
                      sx={[
                        { ...listButtonStyle },
                        // pathname === "/carts" && { ...activeStyle },
                      ]}
                      onClick={() => handleOpemMenu("User")}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 17.5V15.8333C5 14.9493 5.35119 14.1014 5.97631 13.4763C6.60143 12.8512 7.44928 12.5 8.33333 12.5H10.4167M15.8342 17.5C15.3921 17.5 14.9682 17.3244 14.6557 17.0118C14.3431 16.6993 14.1675 16.2754 14.1675 15.8333C14.1675 15.3913 14.3431 14.9674 14.6557 14.6548C14.9682 14.3423 15.3921 14.1667 15.8342 14.1667M15.8342 17.5C16.2762 17.5 16.7001 17.3244 17.0127 17.0118C17.3252 16.6993 17.5008 16.2754 17.5008 15.8333C17.5008 15.3913 17.3252 14.9674 17.0127 14.6548C16.7001 14.3423 16.2762 14.1667 15.8342 14.1667M15.8342 17.5V18.75M15.8342 14.1667V12.9167M18.36 14.375L17.2775 15M14.3917 16.6667L13.3083 17.2917M13.3083 14.375L14.3917 15M17.2775 16.6667L18.3608 17.2917M6.66667 5.83333C6.66667 6.71739 7.01786 7.56523 7.64298 8.19036C8.2681 8.81548 9.11595 9.16667 10 9.16667C10.8841 9.16667 11.7319 8.81548 12.357 8.19036C12.9821 7.56523 13.3333 6.71739 13.3333 5.83333C13.3333 4.94928 12.9821 4.10143 12.357 3.47631C11.7319 2.85119 10.8841 2.5 10 2.5C9.11595 2.5 8.2681 2.85119 7.64298 3.47631C7.01786 4.10143 6.66667 4.94928 6.66667 5.83333Z"
                            stroke="#656E81"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary="User" />

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          rotate: openMenu === "User" ? "180deg" : "0deg",
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openMenu === "User"}>
                    <List sx={{ pl: 4, pt: 0 }}>
                      {checkPermission("user_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/user-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/user-list" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="User List" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {checkPermission("user_management") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/user-management"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/user-management" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="User Management" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </>
              )}

              {/* <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleOpemMenu("")}
                  component={Link}
                  to="/branch-list"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/branch-list" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      data-name="Layer 1"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="m22,18.184v-6.741c1.19-.694,2-1.97,2-3.444,0-.093-.013-.186-.038-.275l-1.172-4.099c-.61-2.135-2.588-3.626-4.808-3.626H6.018C3.798,0,1.82,1.491,1.209,3.626L.038,7.725c-.025.089-.038.182-.038.275,0,1.474.81,2.75,2,3.444v6.741c-1.161.414-2,1.514-2,2.816,0,1.654,1.346,3,3,3h18c1.654,0,3-1.346,3-3,0-1.302-.839-2.402-2-2.816ZM3.132,4.176c.367-1.281,1.554-2.176,2.886-2.176h.982v2c0,.552.447,1,1,1s1-.448,1-1v-2h6v2c0,.552.447,1,1,1s1-.448,1-1v-2h.982c1.332,0,2.519.895,2.885,2.176l1.129,3.951c-.065,1.044-.936,1.874-1.996,1.874h-1c-1.103,0-2-.897-2-2,0-.552-.447-1-1-1s-1,.448-1,1c0,1.103-.897,2-2,2h-2c-1.103,0-2-.897-2-2,0-.552-.447-1-1-1s-1,.448-1,1c0,1.103-.897,2-2,2h-1c-1.061,0-1.931-.83-1.996-1.874l1.128-3.951Zm1.868,7.824c1.201,0,2.266-.542,3-1.382.734.84,1.799,1.382,3,1.382h2c1.201,0,2.266-.542,3-1.382.734.84,1.799,1.382,3,1.382h1v6h-4.5c-.266,0-.52.105-.707.293l-.707.707h-4.172l-.707-.707c-.188-.188-.441-.293-.707-.293h-4.5v-6h1Zm16,10H3c-.552,0-1-.449-1-1s.448-1,1-1h5.086l.707.707c.188.188.441.293.707.293h5c.266,0,.52-.105.707-.293l.707-.707h5.086c.552,0,1,.449,1,1s-.448,1-1,1Z"
                        fill="#656E81"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText primary="Branch" />
               
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleOpemMenu("")}
                  component={Link}
                  to="/category-list"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/category-list" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Layer_1"
                      data-name="Layer 1"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="#656E81"
                    >
                      <path d="m19,0H5C2.243,0,0,2.243,0,5v14c0,2.757,2.243,5,5,5h14c2.757,0,5-2.243,5-5V5c0-2.757-2.243-5-5-5Zm3,19c0,1.654-1.346,3-3,3H5c-1.654,0-3-1.346-3-3V5c0-1.654,1.346-3,3-3h14c1.654,0,3,1.346,3,3v14ZM9.5,4h-4c-.827,0-1.5.673-1.5,1.5v4c0,.827.673,1.5,1.5,1.5h4c.827,0,1.5-.673,1.5-1.5v-4c0-.827-.673-1.5-1.5-1.5Zm-.5,5h-3v-3h3v3Zm9.5-5h-4c-.827,0-1.5.673-1.5,1.5v4c0,.827.673,1.5,1.5,1.5h4c.827,0,1.5-.673,1.5-1.5v-4c0-.827-.673-1.5-1.5-1.5Zm-.5,5h-3v-3h3v3Zm-8.5,4h-4c-.827,0-1.5.673-1.5,1.5v4c0,.827.673,1.5,1.5,1.5h4c.827,0,1.5-.673,1.5-1.5v-4c0-.827-.673-1.5-1.5-1.5Zm-.5,5h-3v-3h3v3Zm9.5-5h-4c-.827,0-1.5.673-1.5,1.5v4c0,.827.673,1.5,1.5,1.5h4c.827,0,1.5-.673,1.5-1.5v-4c0-.827-.673-1.5-1.5-1.5Zm-.5,5h-3v-3h3v3Z" />
                    </svg>
                  </ListItemIcon>
                  <ListItemText primary="Category" />
 
                </ListItemButton>
              </ListItem> */}
              {checkMultiplePermission(["supplier_list", "customer_list"]) && (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      // component={Link}
                      // to="/carts"
                      sx={[
                        { ...listButtonStyle },
                        // pathname === "/carts" && { ...activeStyle },
                      ]}
                      onClick={() => handleOpemMenu("Contacts")}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.33337 13.333H13.3334M3.33337 6.66634H5.83337M3.33337 9.99967H5.83337M3.33337 13.333H5.83337M16.6667 4.99967V14.9997C16.6667 15.4417 16.4911 15.8656 16.1786 16.1782C15.866 16.4907 15.4421 16.6663 15 16.6663H6.66671C6.22468 16.6663 5.80076 16.4907 5.4882 16.1782C5.17564 15.8656 5.00004 15.4417 5.00004 14.9997V4.99967C5.00004 4.55765 5.17564 4.13372 5.4882 3.82116C5.80076 3.5086 6.22468 3.33301 6.66671 3.33301H15C15.4421 3.33301 15.866 3.5086 16.1786 3.82116C16.4911 4.13372 16.6667 4.55765 16.6667 4.99967ZM9.16671 9.16634C9.16671 9.60837 9.3423 10.0323 9.65486 10.3449C9.96742 10.6574 10.3913 10.833 10.8334 10.833C11.2754 10.833 11.6993 10.6574 12.0119 10.3449C12.3244 10.0323 12.5 9.60837 12.5 9.16634C12.5 8.72431 12.3244 8.30039 12.0119 7.98783C11.6993 7.67527 11.2754 7.49967 10.8334 7.49967C10.3913 7.49967 9.96742 7.67527 9.65486 7.98783C9.3423 8.30039 9.16671 8.72431 9.16671 9.16634Z"
                            stroke="#667085"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary="Contacts" />

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          rotate: openMenu === "Contacts" ? "180deg" : "0deg",
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openMenu === "Contacts"}>
                    <List sx={{ pl: 4, pt: 0 }}>
                      {checkPermission("supplier_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/suppliers"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/suppliers" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Suppliers" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {checkPermission("customer_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/customer"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/customer" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Customer" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {/* <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/customer-group"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/customer-group" && { ...activeStyle },
                      ]}
                    >
                      <ListItemText primary="Customer Group" />
                    </ListItemButton>
                  </ListItem> */}

                      {/* <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/import-export"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/import-export" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemText primary="Import & Export" />
                    </ListItemButton>
                  </ListItem> */}
                    </List>
                  </Collapse>
                </>
              )}
              {checkMultiplePermission([
                "spare_parts_list",
                "stock_alert_list",
                "branch_stock_list",
              ]) && (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      // component={Link}
                      // to="/carts"
                      sx={[
                        { ...listButtonStyle },
                        // pathname === "/carts" && { ...activeStyle },
                      ]}
                      onClick={() => handleOpemMenu("Product")}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clip-path="url(#clip0_3_14882)">
                            <path
                              d="M1.66699 11.25L5.83366 13.75V18.3333M1.66699 11.25L5.83366 8.74996L10.0003 11.25M1.66699 11.25V15.8333L5.83366 18.3333M10.0003 11.25V15.8333M10.0003 11.25L14.167 13.75M10.0003 11.25L14.167 8.74996M10.0003 11.25V6.66663M10.0003 15.8333L5.83366 18.3333M10.0003 15.8333L14.167 18.3333M5.83366 13.7875L10.0003 11.2625M14.167 13.75V18.3333M14.167 13.75L18.3337 11.25M14.167 8.74996L18.3337 11.25M14.167 8.74996V4.16663M18.3337 11.25V15.8333L14.167 18.3333M10.0003 6.66663L5.83366 4.16663L10.0003 1.66663L14.167 4.16663M10.0003 6.66663L14.167 4.16663M5.83366 4.19162V8.73746"
                              stroke="#656E81"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_3_14882">
                              <rect width="20" height="20" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary="Product" />

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          rotate: openMenu === "Product" ? "180deg" : "0deg",
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openMenu === "Product"}>
                    <List sx={{ pl: 4, pt: 0 }}>
                      {checkPermission("spare_parts_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/spare-parts-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/spare-parts-list" && {
                                ...activeStyle,
                              },
                            ]}
                          >
                            <ListItemText primary="Spare parts List" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {/* <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/add-spare-parts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/add-spare-parts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemText primary="Add Spare parts" />
                    </ListItemButton>
                  </ListItem> */}
                      {/* {checkPermission("stock_alert_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/stock-alert"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/stock-alert" && { ...activeStyle },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="Stock Alert" />
                          </ListItemButton>
                        </ListItem>
                      )} */}
                      {/* {checkPermission("branch_stock_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/branch-stock"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/branch-stock" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="Branch Stock" />
                          </ListItemButton>
                        </ListItem>
                      )} */}
                      {checkPermission("all_branch_stock_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/all-branch-stock"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/all-branch-stock" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="All Branch Stock" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </>
              )}
              {/* 222 */}

              {checkMultiplePermission([
                "purchase_list",
                "purchase_return_list",
              ]) && (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      // component={Link}
                      // to="/carts"
                      sx={[
                        { ...listButtonStyle },
                        // pathname === "/carts" && { ...activeStyle },
                      ]}
                      onClick={() => handleOpemMenu("Purchase")}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.50033 4.16667H5.83366C5.39163 4.16667 4.96771 4.34226 4.65515 4.65482C4.34259 4.96738 4.16699 5.39131 4.16699 5.83333V15.8333C4.16699 16.2754 4.34259 16.6993 4.65515 17.0118C4.96771 17.3244 5.39163 17.5 5.83366 17.5H14.167C14.609 17.5 15.0329 17.3244 15.3455 17.0118C15.6581 16.6993 15.8337 16.2754 15.8337 15.8333V5.83333C15.8337 5.39131 15.6581 4.96738 15.3455 4.65482C15.0329 4.34226 14.609 4.16667 14.167 4.16667H12.5003M7.50033 4.16667C7.50033 3.72464 7.67592 3.30072 7.98848 2.98816C8.30104 2.67559 8.72496 2.5 9.16699 2.5H10.8337C11.2757 2.5 11.6996 2.67559 12.0122 2.98816C12.3247 3.30072 12.5003 3.72464 12.5003 4.16667M7.50033 4.16667C7.50033 4.60869 7.67592 5.03262 7.98848 5.34518C8.30104 5.65774 8.72496 5.83333 9.16699 5.83333H10.8337C11.2757 5.83333 11.6996 5.65774 12.0122 5.34518C12.3247 5.03262 12.5003 4.60869 12.5003 4.16667M7.50033 10H7.50866M10.8337 10H12.5003M7.50033 13.3333H7.50866M10.8337 13.3333H12.5003"
                            stroke="#667085"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary="Purchase" />

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          rotate: openMenu === "Purchase" ? "180deg" : "0deg",
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openMenu === "Purchase"}>
                    <List sx={{ pl: 4, pt: 0 }}>
                      {checkPermission("purchase_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/purchase-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/purchase-list" && {
                                ...activeStyle,
                              },
                            ]}
                          >
                            <ListItemText primary="Purchases List" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {/* <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/add-purchase"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/add-purchase" && { ...activeStyle },
                      ]}
                    >
                      <ListItemText primary="Add Purchase" />
                    </ListItemButton>
                  </ListItem> */}
                      {/* <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/purchase-return"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/purchase-return" && { ...activeStyle },
                      ]}
                    >
                      <ListItemText primary="Purchase Return" />
                    </ListItemButton>
                  </ListItem> */}
                      {checkPermission("purchase_return_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/purchase-return-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/purchase-return-list" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="Purchase Return List" />
                          </ListItemButton>
                        </ListItem>
                      )}
                    </List>
                  </Collapse>
                </>
              )}
              {checkPermission("repair_list") && (
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => handleOpemMenu("")}
                    component={Link}
                    to="/repair"
                    sx={[
                      { ...listButtonStyle },
                      pathname === "/repair" && { ...activeStyle },
                    ]}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.83354 8.33329H8.33354V5.83329L5.41687 2.91663C6.3499 2.47102 7.39812 2.32563 8.4172 2.50048C9.43628 2.67533 10.3761 3.16181 11.1072 3.89294C11.8384 4.62407 12.3248 5.56388 12.4997 6.58296C12.6745 7.60204 12.5291 8.65027 12.0835 9.58329L17.0835 14.5833C17.4151 14.9148 17.6013 15.3645 17.6013 15.8333C17.6013 16.3021 17.4151 16.7518 17.0835 17.0833C16.752 17.4148 16.3024 17.6011 15.8335 17.6011C15.3647 17.6011 14.9151 17.4148 14.5835 17.0833L9.58354 12.0833C8.65051 12.5289 7.60229 12.6743 6.58321 12.4994C5.56412 12.3246 4.62431 11.8381 3.89318 11.107C3.16205 10.3759 2.67557 9.43604 2.50072 8.41696C2.32588 7.39788 2.47127 6.34965 2.91687 5.41663L5.83354 8.33329Z"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText primary="Repair" />
                    {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                  </ListItemButton>
                </ListItem>
              )}
              {checkPermission("service_list") && (
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => handleOpemMenu("")}
                    component={Link}
                    to="/service-list"
                    sx={[
                      { ...listButtonStyle },
                      pathname === "/service-list" && { ...activeStyle },
                    ]}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      {/* <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.83354 8.33329H8.33354V5.83329L5.41687 2.91663C6.3499 2.47102 7.39812 2.32563 8.4172 2.50048C9.43628 2.67533 10.3761 3.16181 11.1072 3.89294C11.8384 4.62407 12.3248 5.56388 12.4997 6.58296C12.6745 7.60204 12.5291 8.65027 12.0835 9.58329L17.0835 14.5833C17.4151 14.9148 17.6013 15.3645 17.6013 15.8333C17.6013 16.3021 17.4151 16.7518 17.0835 17.0833C16.752 17.4148 16.3024 17.6011 15.8335 17.6011C15.3647 17.6011 14.9151 17.4148 14.5835 17.0833L9.58354 12.0833C8.65051 12.5289 7.60229 12.6743 6.58321 12.4994C5.56412 12.3246 4.62431 11.8381 3.89318 11.107C3.16205 10.3759 2.67557 9.43604 2.50072 8.41696C2.32588 7.39788 2.47127 6.34965 2.91687 5.41663L5.83354 8.33329Z"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg> */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 50 50"
                        width="22px"
                        height="22px"
                      >
                        <path
                          d="M 23.597656 2 C 23.113281 1.996094 22.695313 2.34375 22.609375 2.820313 L 22.0625 5.8125 C 21.59375 5.964844 21.140625 6.148438 20.695313 6.367188 L 18.238281 4.59375 C 17.84375 4.308594 17.296875 4.347656 16.953125 4.695313 L 14.816406 6.796875 C 14.472656 7.140625 14.421875 7.679688 14.699219 8.078125 L 16.425781 10.578125 C 16.199219 11.019531 16.007813 11.472656 15.855469 11.9375 L 12.859375 12.421875 C 12.378906 12.496094 12.023438 12.910156 12.019531 13.402344 L 12 16.402344 C 11.996094 16.886719 12.34375 17.304688 12.820313 17.390625 L 15.824219 17.9375 C 15.972656 18.402344 16.160156 18.851563 16.378906 19.292969 L 14.59375 21.761719 C 14.308594 22.15625 14.347656 22.703125 14.691406 23.050781 L 16.800781 25.183594 C 17.140625 25.527344 17.679688 25.578125 18.078125 25.300781 L 20.609375 23.558594 C 21.046875 23.78125 21.496094 23.964844 21.957031 24.117188 L 22.472656 27.148438 C 22.554688 27.628906 22.964844 27.980469 23.453125 27.984375 L 26.449219 28 C 26.941406 28.003906 27.359375 27.648438 27.441406 27.167969 L 27.953125 24.140625 C 28.410156 23.992188 28.855469 23.8125 29.289063 23.59375 L 31.800781 25.378906 C 32.199219 25.660156 32.738281 25.613281 33.082031 25.273438 L 35.21875 23.167969 C 35.566406 22.824219 35.613281 22.277344 35.328125 21.875 L 33.546875 19.375 C 33.769531 18.941406 33.957031 18.5 34.109375 18.046875 L 37.152344 17.53125 C 37.628906 17.449219 37.980469 17.035156 37.984375 16.546875 L 38 13.550781 C 38.003906 13.0625 37.652344 12.644531 37.167969 12.5625 L 34.152344 12.050781 C 34.003906 11.589844 33.820313 11.140625 33.605469 10.699219 L 35.378906 8.195313 C 35.664063 7.800781 35.621094 7.261719 35.277344 6.914063 L 33.167969 4.78125 C 32.824219 4.4375 32.277344 4.386719 31.878906 4.671875 L 29.402344 6.429688 C 28.964844 6.207031 28.519531 6.019531 28.0625 5.867188 L 27.578125 2.859375 C 27.5 2.375 27.085938 2.019531 26.59375 2.015625 Z M 24.425781 4.003906 L 25.738281 4.011719 L 26.171875 6.714844 C 26.234375 7.109375 26.527344 7.425781 26.910156 7.523438 C 27.644531 7.710938 28.351563 8.011719 29.015625 8.414063 C 29.355469 8.625 29.789063 8.609375 30.113281 8.378906 L 32.34375 6.796875 L 33.265625 7.726563 L 31.660156 9.976563 C 31.433594 10.300781 31.414063 10.726563 31.617188 11.066406 C 32.011719 11.734375 32.300781 12.445313 32.472656 13.175781 C 32.566406 13.566406 32.882813 13.863281 33.28125 13.933594 L 35.996094 14.390625 L 35.988281 15.699219 L 33.246094 16.160156 C 32.855469 16.226563 32.539063 16.519531 32.441406 16.902344 C 32.257813 17.628906 31.964844 18.332031 31.5625 18.988281 C 31.355469 19.332031 31.371094 19.765625 31.605469 20.089844 L 33.203125 22.34375 L 32.277344 23.261719 L 30.007813 21.652344 C 29.683594 21.421875 29.257813 21.40625 28.917969 21.609375 C 28.253906 22.003906 27.550781 22.285156 26.820313 22.464844 C 26.429688 22.558594 26.136719 22.875 26.070313 23.269531 L 25.609375 25.996094 L 24.304688 25.984375 L 23.84375 23.25 C 23.777344 22.859375 23.484375 22.542969 23.09375 22.449219 C 22.371094 22.269531 21.660156 21.972656 20.996094 21.574219 C 20.660156 21.371094 20.234375 21.382813 19.910156 21.609375 L 17.632813 23.179688 L 16.710938 22.246094 L 18.316406 20.027344 C 18.550781 19.703125 18.570313 19.269531 18.363281 18.925781 C 17.96875 18.257813 17.679688 17.546875 17.5 16.8125 C 17.40625 16.429688 17.097656 16.136719 16.707031 16.0625 L 14.003906 15.574219 L 14.015625 14.261719 L 16.707031 13.828125 C 17.101563 13.765625 17.421875 13.472656 17.519531 13.085938 C 17.707031 12.347656 18 11.636719 18.40625 10.972656 C 18.613281 10.636719 18.601563 10.207031 18.375 9.882813 L 16.824219 7.632813 L 17.753906 6.710938 L 19.964844 8.304688 C 20.285156 8.539063 20.714844 8.558594 21.058594 8.359375 C 21.730469 7.957031 22.445313 7.671875 23.183594 7.492188 C 23.570313 7.402344 23.863281 7.089844 23.933594 6.703125 Z M 24.988281 10.035156 C 23.703125 10.027344 22.414063 10.507813 21.433594 11.480469 C 19.472656 13.417969 19.457031 16.609375 21.394531 18.574219 C 23.332031 20.535156 26.527344 20.550781 28.488281 18.613281 C 30.449219 16.675781 30.464844 13.480469 28.527344 11.519531 C 27.558594 10.539063 26.273438 10.042969 24.988281 10.035156 Z M 24.980469 12.023438 C 25.75 12.027344 26.515625 12.328125 27.105469 12.925781 C 28.285156 14.117188 28.273438 16.011719 27.082031 17.1875 C 25.890625 18.367188 23.996094 18.359375 22.816406 17.167969 C 21.636719 15.972656 21.648438 14.078125 22.839844 12.902344 C 23.4375 12.3125 24.207031 12.019531 24.980469 12.023438 Z M 14.421875 28 C 11.8125 28 10.609375 28.625 9.3125 29.125 C 9.3125 29.128906 9.3125 29.128906 9.3125 29.128906 C 6.824219 30.097656 2.566406 32.105469 2.566406 32.105469 C 2.066406 32.339844 1.851563 32.9375 2.085938 33.4375 C 2.324219 33.9375 2.921875 34.152344 3.421875 33.917969 C 3.421875 33.917969 7.707031 31.898438 10.035156 30.992188 C 11.472656 30.433594 12.097656 30 14.421875 30 C 19.550781 30 19.34375 32.226563 21.507813 33.5 C 21.539063 33.519531 21.574219 33.539063 21.609375 33.550781 C 24.292969 34.753906 27.175781 35 29.5 35 C 30.527344 35 31.175781 35.238281 31.527344 35.503906 C 31.875 35.773438 32 36.050781 32 36.5 C 32 37.027344 31.867188 37.277344 31.519531 37.53125 C 31.175781 37.78125 30.511719 38 29.5 38 L 24.25 38 C 22.046875 38 18.253906 37.03125 18.253906 37.03125 C 17.910156 36.9375 17.539063 37.039063 17.285156 37.292969 C 17.03125 37.546875 16.933594 37.917969 17.027344 38.261719 C 17.125 38.609375 17.398438 38.878906 17.746094 38.96875 C 17.746094 38.96875 21.507813 40 24.25 40 L 29.5 40 C 30.519531 40 31.40625 39.832031 32.148438 39.464844 C 32.246094 39.4375 32.339844 39.394531 32.421875 39.335938 L 41.90625 33.113281 C 43.332031 32.289063 44.304688 32.058594 44.875 32.066406 C 45.445313 32.078125 45.640625 32.25 45.8125 32.46875 C 46.066406 32.796875 46.082031 32.921875 45.917969 33.300781 C 45.75 33.683594 45.261719 34.273438 44.382813 34.882813 C 44.382813 34.882813 44.382813 34.882813 44.378906 34.882813 C 43.292969 35.640625 31.148438 43.554688 29.746094 44.351563 C 28.6875 44.953125 27.847656 45.585938 26.890625 45.855469 C 25.933594 46.121094 24.804688 46.121094 22.9375 45.230469 C 21.691406 44.632813 16.386719 41.914063 14.667969 41.042969 C 13.710938 40.558594 12.894531 40.285156 12.0625 40.332031 C 11.226563 40.378906 10.519531 40.734375 9.789063 41.195313 C 9.785156 41.195313 9.78125 41.199219 9.78125 41.203125 L 7.304688 42.785156 C 6.992188 42.972656 6.808594 43.316406 6.820313 43.679688 C 6.832031 44.042969 7.042969 44.371094 7.367188 44.535156 C 7.695313 44.699219 8.082031 44.675781 8.382813 44.46875 L 10.847656 42.890625 C 11.484375 42.492188 11.84375 42.347656 12.171875 42.328125 C 12.5 42.308594 12.949219 42.414063 13.765625 42.828125 C 15.46875 43.691406 20.691406 46.371094 22.078125 47.03125 C 24.253906 48.074219 26.015625 48.171875 27.425781 47.78125 C 28.835938 47.386719 29.839844 46.597656 30.734375 46.089844 C 32.664063 44.992188 44.128906 37.492188 45.523438 36.523438 C 46.582031 35.785156 47.359375 35.015625 47.753906 34.09375 C 48.148438 33.171875 48.019531 32.046875 47.390625 31.242188 C 47.390625 31.242188 47.390625 31.242188 47.390625 31.238281 C 46.894531 30.605469 46.015625 30.089844 44.910156 30.066406 C 44.28125 30.054688 43.582031 30.199219 42.804688 30.484375 C 42.660156 30.292969 42.441406 30.042969 42.140625 29.824219 C 41.558594 29.390625 40.632813 29 39.375 29 C 38.730469 29 38.203125 29.148438 37.78125 29.324219 C 37.179688 28.75 36.113281 28.019531 34.5625 28.019531 C 33.304688 28.019531 32.125 28.441406 31.304688 28.925781 C 31.152344 29.015625 30.785156 29.246094 30.160156 29.636719 C 29.535156 30.027344 28.71875 30.53125 27.914063 31.035156 C 26.628906 31.835938 25.832031 32.335938 25.371094 32.625 C 24.390625 32.429688 23.410156 32.152344 22.484375 31.746094 C 21.695313 31.238281 20.175781 28 14.421875 28 Z M 34.5625 30.019531 C 35.195313 30.019531 35.648438 30.179688 35.96875 30.367188 L 31.34375 33.234375 C 30.792969 33.078125 30.175781 33 29.5 33 C 29.210938 33 28.894531 32.980469 28.59375 32.96875 C 28.78125 32.851563 28.78125 32.851563 28.972656 32.734375 C 29.777344 32.230469 30.589844 31.722656 31.21875 31.332031 C 31.84375 30.945313 32.355469 30.628906 32.320313 30.648438 C 32.792969 30.367188 33.820313 30.019531 34.5625 30.019531 Z M 39.375 31 C 40.1875 31 40.625 31.207031 40.890625 31.390625 C 40.875 31.398438 40.863281 31.40625 40.847656 31.417969 L 33.9375 35.949219 C 33.84375 35.390625 33.613281 34.855469 33.246094 34.410156 L 38.078125 31.414063 L 38.082031 31.40625 C 38.121094 31.386719 38.957031 31 39.375 31 Z"
                          stroke="#656E81"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText primary="Service" />
                    {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                  </ListItemButton>
                </ListItem>
              )}
              {checkPermission("stock_transfer_list") && (
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    onClick={() => handleOpemMenu("")}
                    component={Link}
                    to="/stock-transfer-list"
                    sx={[
                      { ...listButtonStyle },
                      pathname === "/stock-transfer-list" && { ...activeStyle },
                    ]}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: 1.5,
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.5 9.16667V6.66667C17.5 6.22464 17.3244 5.80072 17.0118 5.48816C16.6993 5.17559 16.2754 5 15.8333 5H10.8333M10.8333 5L13.3333 7.5M10.8333 5L13.3333 2.5M2.5 10.8333V13.3333C2.5 13.7754 2.67559 14.1993 2.98816 14.5118C3.30072 14.8244 3.72464 15 4.16667 15H9.16667M9.16667 15L6.66667 12.5M9.16667 15L6.66667 17.5M2.5 5C2.5 5.66304 2.76339 6.29893 3.23223 6.76777C3.70107 7.23661 4.33696 7.5 5 7.5C5.66304 7.5 6.29893 7.23661 6.76777 6.76777C7.23661 6.29893 7.5 5.66304 7.5 5C7.5 4.33696 7.23661 3.70107 6.76777 3.23223C6.29893 2.76339 5.66304 2.5 5 2.5C4.33696 2.5 3.70107 2.76339 3.23223 3.23223C2.76339 3.70107 2.5 4.33696 2.5 5ZM12.5 15C12.5 15.663 12.7634 16.2989 13.2322 16.7678C13.7011 17.2366 14.337 17.5 15 17.5C15.663 17.5 16.2989 17.2366 16.7678 16.7678C17.2366 16.2989 17.5 15.663 17.5 15C17.5 14.337 17.2366 13.7011 16.7678 13.2322C16.2989 12.7634 15.663 12.5 15 12.5C14.337 12.5 13.7011 12.7634 13.2322 13.2322C12.7634 13.7011 12.5 14.337 12.5 15Z"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText primary="Stock Transfer" />
                    {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                  </ListItemButton>
                </ListItem>
              )}
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleOpemMenu("")}
                  // component={Link}
                  // to="/live-chat"

                  sx={[
                    { ...listButtonStyle },
                    pathname === "/live-chat" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.99967 9.99992C4.55765 9.99992 4.13372 9.82432 3.82116 9.51176C3.5086 9.1992 3.33301 8.77528 3.33301 8.33325C3.33301 7.89122 3.5086 7.4673 3.82116 7.15474C4.13372 6.84218 4.55765 6.66659 4.99967 6.66659M4.99967 9.99992C5.4417 9.99992 5.86563 9.82432 6.17819 9.51176C6.49075 9.1992 6.66634 8.77528 6.66634 8.33325C6.66634 7.89122 6.49075 7.4673 6.17819 7.15474C5.86563 6.84218 5.4417 6.66659 4.99967 6.66659M4.99967 9.99992V16.6666M4.99967 6.66659V3.33325M10.9988 11.9991C10.7875 11.8409 10.5416 11.7351 10.2814 11.6905C10.0211 11.6459 9.75404 11.6638 9.50208 11.7427C9.25012 11.8216 9.0205 11.9592 8.83213 12.1441C8.64377 12.3291 8.50205 12.5562 8.41864 12.8067C8.33523 13.0572 8.31253 13.324 8.3524 13.5849C8.39227 13.8459 8.49357 14.0937 8.64796 14.3079C8.80236 14.5221 9.00542 14.6965 9.24042 14.8168C9.47543 14.9371 9.73566 14.9999 9.99968 14.9999L9.99967 16.6666M9.99967 3.33325V11.6666M14.9997 7.49992C14.5576 7.49992 14.1337 7.32432 13.8212 7.01176C13.5086 6.6992 13.333 6.27528 13.333 5.83325C13.333 5.39122 13.5086 4.9673 13.8212 4.65474C14.1337 4.34218 14.5576 4.16659 14.9997 4.16659M14.9997 7.49992C15.4417 7.49992 15.8656 7.32432 16.1782 7.01176C16.4907 6.6992 16.6663 6.27528 16.6663 5.83325C16.6663 5.39122 16.4907 4.9673 16.1782 4.65474C15.8656 4.34218 15.4417 4.16659 14.9997 4.16659M14.9997 7.49992V9.58325M14.9997 4.16659V3.33325M15.8338 17.4999C15.3918 17.4999 14.9679 17.3243 14.6553 17.0118C14.3428 16.6992 14.1672 16.2753 14.1672 15.8333C14.1672 15.3912 14.3428 14.9673 14.6553 14.6547C14.9679 14.3422 15.3918 14.1666 15.8338 14.1666M15.8338 17.4999C16.2759 17.4999 16.6998 17.3243 17.0124 17.0118C17.3249 16.6992 17.5005 16.2753 17.5005 15.8333C17.5005 15.3912 17.3249 14.9673 17.0124 14.6547C16.6998 14.3422 16.2759 14.1666 15.8338 14.1666M15.8338 17.4999V18.7499M15.8338 14.1666V12.9166M18.3597 14.3749L17.2772 14.9999M14.3913 16.6666L13.308 17.2916M13.308 14.3749L14.3913 14.9999M17.2772 16.6666L18.3605 17.2916"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText primary="Stock Adjustment" />
                  {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  onClick={() => handleOpemMenu("")}
                  // component={Link}
                  // to="/live-chat"

                  sx={[
                    { ...listButtonStyle },
                    pathname === "/live-chat" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.66634 4.16667H4.99967C4.55765 4.16667 4.13372 4.34226 3.82116 4.65482C3.5086 4.96738 3.33301 5.39131 3.33301 5.83333V15.8333C3.33301 16.2754 3.5086 16.6993 3.82116 17.0118C4.13372 17.3244 4.55765 17.5 4.99967 17.5H9.74717M6.66634 4.16667C6.66634 3.72464 6.84194 3.30072 7.1545 2.98816C7.46706 2.67559 7.89098 2.5 8.33301 2.5H9.99967C10.4417 2.5 10.8656 2.67559 11.1782 2.98816C11.4907 3.30072 11.6663 3.72464 11.6663 4.16667M6.66634 4.16667C6.66634 4.60869 6.84194 5.03262 7.1545 5.34518C7.46706 5.65774 7.89098 5.83333 8.33301 5.83333H9.99967C10.4417 5.83333 10.8656 5.65774 11.1782 5.34518C11.4907 5.03262 11.6663 4.60869 11.6663 4.16667M14.9997 11.6667V15H18.333M14.9997 11.6667C15.8837 11.6667 16.7316 12.0179 17.3567 12.643C17.9818 13.2681 18.333 14.1159 18.333 15M14.9997 11.6667C14.1156 11.6667 13.2678 12.0179 12.6427 12.643C12.0175 13.2681 11.6663 14.1159 11.6663 15C11.6663 15.8841 12.0175 16.7319 12.6427 17.357C13.2678 17.9821 14.1156 18.3333 14.9997 18.3333C15.8837 18.3333 16.7316 17.9821 17.3567 17.357C17.9818 16.7319 18.333 15.8841 18.333 15M14.9997 9.16667V5.83333C14.9997 5.39131 14.8241 4.96738 14.5115 4.65482C14.199 4.34226 13.775 4.16667 13.333 4.16667H11.6663M6.66634 9.16667H9.99967M6.66634 12.5H9.16634"
                        stroke="#656E81"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                  {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                </ListItemButton>
              </ListItem>

              {checkMultiplePermission([
                "branch_list",
                "brand_list",
                "category_list",
                "device_list",
                "model_list",
                "variant_list",
              ]) && (
                <>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      // component={Link}
                      // to="/carts"
                      sx={[
                        { ...listButtonStyle },
                        // pathname === "/carts" && { ...activeStyle },
                      ]}
                      onClick={() => handleOpemMenu("Settings")}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1.5,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.60417 3.5975C8.95917 2.13417 11.0408 2.13417 11.3958 3.5975C11.4491 3.81733 11.5535 4.02148 11.7006 4.19333C11.8477 4.36518 12.0332 4.49988 12.2422 4.58645C12.4512 4.67303 12.6776 4.70904 12.9032 4.69156C13.1287 4.67407 13.3469 4.60359 13.54 4.48583C14.8258 3.7025 16.2983 5.17417 15.515 6.46083C15.3974 6.65388 15.327 6.87195 15.3096 7.09731C15.2922 7.32267 15.3281 7.54897 15.4146 7.75782C15.5011 7.96666 15.6356 8.15215 15.8073 8.29921C15.9789 8.44627 16.1829 8.55075 16.4025 8.60417C17.8658 8.95917 17.8658 11.0408 16.4025 11.3958C16.1827 11.4491 15.9785 11.5535 15.8067 11.7006C15.6348 11.8477 15.5001 12.0332 15.4135 12.2422C15.327 12.4512 15.291 12.6776 15.3084 12.9032C15.3259 13.1287 15.3964 13.3469 15.5142 13.54C16.2975 14.8258 14.8258 16.2983 13.5392 15.515C13.3461 15.3974 13.1281 15.327 12.9027 15.3096C12.6773 15.2922 12.451 15.3281 12.2422 15.4146C12.0333 15.5011 11.8479 15.6356 11.7008 15.8073C11.5537 15.9789 11.4492 16.1829 11.3958 16.4025C11.0408 17.8658 8.95917 17.8658 8.60417 16.4025C8.5509 16.1827 8.44648 15.9785 8.29941 15.8067C8.15233 15.6348 7.96676 15.5001 7.75779 15.4135C7.54882 15.327 7.32236 15.291 7.09685 15.3084C6.87133 15.3259 6.65313 15.3964 6.46 15.5142C5.17417 16.2975 3.70167 14.8258 4.485 13.5392C4.60258 13.3461 4.67296 13.1281 4.6904 12.9027C4.70785 12.6773 4.67187 12.451 4.58539 12.2422C4.49892 12.0333 4.36438 11.8479 4.19273 11.7008C4.02107 11.5537 3.81714 11.4492 3.5975 11.3958C2.13417 11.0408 2.13417 8.95917 3.5975 8.60417C3.81733 8.5509 4.02148 8.44648 4.19333 8.29941C4.36518 8.15233 4.49988 7.96676 4.58645 7.75779C4.67303 7.54882 4.70904 7.32236 4.69156 7.09685C4.67407 6.87133 4.60359 6.65313 4.48583 6.46C3.7025 5.17417 5.17417 3.70167 6.46083 4.485C7.29417 4.99167 8.37417 4.54333 8.60417 3.5975Z"
                            stroke="#656E81"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.5 10C7.5 10.663 7.76339 11.2989 8.23223 11.7678C8.70107 12.2366 9.33696 12.5 10 12.5C10.663 12.5 11.2989 12.2366 11.7678 11.7678C12.2366 11.2989 12.5 10.663 12.5 10C12.5 9.33696 12.2366 8.70107 11.7678 8.23223C11.2989 7.76339 10.663 7.5 10 7.5C9.33696 7.5 8.70107 7.76339 8.23223 8.23223C7.76339 8.70107 7.5 9.33696 7.5 10Z"
                            stroke="#656E81"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText primary="Settings" />

                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          rotate: openMenu === "Settings" ? "180deg" : "0deg",
                        }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="#656E81"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemButton>
                  </ListItem>

                  <Collapse in={openMenu === "Settings"}>
                    <List sx={{ pl: 4, pt: 0 }}>
                      {checkPermission("branch_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/branch-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/branch-list" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Branch" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {checkPermission("brand_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/brand-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/brand-list" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Brand" />
                          </ListItemButton>
                        </ListItem>
                      )}

                      {checkPermission("category_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/category-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/category-list" && {
                                ...activeStyle,
                              },
                            ]}
                          >
                            <ListItemText primary="Category" />
                          </ListItemButton>
                        </ListItem>
                      )}

                      {checkPermission("device_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/device-brand-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/device-brand-list" && {
                                ...activeStyle,
                              },
                            ]}
                          >
                            <ListItemText primary="Device Brand" />
                          </ListItemButton>
                        </ListItem>
                      )}
                      {checkPermission("device_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/device-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/device-list" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Device" />
                          </ListItemButton>
                        </ListItem>
                      )}

                      {checkPermission("model_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/model-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/model-list" && { ...activeStyle },
                            ]}
                          >
                            <ListItemText primary="Model" />
                          </ListItemButton>
                        </ListItem>
                      )}

                      {/* {checkPermission("variant_list") && (
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/variant-list"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/variant-list" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemText primary="Variant" />
                          </ListItemButton>
                        </ListItem>
                      )} */}
                    </List>
                  </Collapse>
                </>
              )}
            </Box>
          </List>

          <List sx={{ pt: 0 }}>
            <LightTooltip
              // open={true}
              disableFocusListener={true}
              arrow
              sx={{ fontSize: "16px" }}
              title={
                <List sx={{ pb: 0, mt: 0, pb: 0, minWidth: "238px" }}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/profile"
                      sx={[
                        { ...listButtonStyle },
                        {
                          mr: 0,
                          ml: 0,
                          ["& .MuiTypography-root"]: {
                            color: "#fff",
                          },
                        },
                        pathname === "/profile" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.0003 10.9999C13.5316 10.9999 15.5837 8.94789 15.5837 6.41659C15.5837 3.88528 13.5316 1.83325 11.0003 1.83325C8.46902 1.83325 6.41699 3.88528 6.41699 6.41659C6.41699 8.94789 8.46902 10.9999 11.0003 10.9999Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M18.8743 20.1667C18.8743 16.6192 15.3451 13.75 11.0001 13.75C6.65514 13.75 3.12598 16.6192 3.12598 20.1667"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Profile"
                        //
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/notification"
                      sx={[
                        { ...listButtonStyle },
                        {
                          mr: 0,
                          ml: 0,
                          ["& .MuiTypography-root"]: {
                            color: "#fff",
                          },
                        },
                        pathname === "/notification" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11 5.90332V8.95582"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                          />
                          <path
                            d="M11.018 1.83325C7.64466 1.83325 4.913 4.56492 4.913 7.93825V9.86325C4.913 10.4866 4.65633 11.4216 4.3355 11.9533L3.17133 13.8966C2.45633 15.0974 2.95133 16.4358 4.27133 16.8758C8.653 18.3333 13.3922 18.3333 17.7738 16.8758C19.0113 16.4633 19.543 15.0149 18.8738 13.8966L17.7097 11.9533C17.3888 11.4216 17.1322 10.4774 17.1322 9.86325V7.93825C17.123 4.58325 14.373 1.83325 11.018 1.83325Z"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                            stroke-linecap="round"
                          />
                          <path
                            d="M14.0523 17.2517C14.0523 18.9292 12.6773 20.3042 10.9998 20.3042C10.1656 20.3042 9.3956 19.9559 8.8456 19.4059C8.2956 18.8559 7.94727 18.0859 7.94727 17.2517"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-miterlimit="10"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Notification"
                        //
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={fnLogout}
                      // component={Link}
                      // to="/logout"
                      sx={[
                        { ...listButtonStyle },
                        {
                          mr: 0,
                          ml: 0,
                          ["& .MuiTypography-root"]: {
                            color: "#fff",
                          },
                        },
                        pathname === "/logout" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: 1,
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8.1582 6.92997C8.44237 3.62997 10.1382 2.28247 13.8507 2.28247H13.9699C18.0674 2.28247 19.7082 3.9233 19.7082 8.0208V13.9975C19.7082 18.095 18.0674 19.7358 13.9699 19.7358H13.8507C10.1657 19.7358 8.46987 18.4066 8.16737 15.1616"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M13.75 11H3.31836"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M5.36283 7.9292L2.29199 11L5.36283 14.0709"
                            stroke="white"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Logout"
                        //
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              }
              placement="right"
              TransitionComponent={Zoom}
            >
              {/* <Divider sx={{ mb: 1 }} /> */}
              <ListItem
                disablePadding
                sx={{ display: "block", borderTop: "1px solid #E5E5E5" }}
              >
                <ListItemButton
                  sx={{
                    ...listButtonStyle,
                    background: "none",
                    mt: 1,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: 1.5,
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/user.png"
                      alt="avatar"
                      width="32px"
                      height="32px"
                      // style={{ position: "relative", left: 7 }}
                    />
                  </ListItemIcon>
                  <ListItemText>
                    {ifixit_admin_panel?.user?.name}
                    <Typography
                      sx={{
                        fontSize: "12px !important",
                        fontWeight: 500,
                        color: "#656E81 !important",
                      }}
                    >
                      {ifixit_admin_panel?.user?.role}
                    </Typography>
                  </ListItemText>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.875 12.5L10 15.625L13.125 12.5M6.875 7.5L10 4.375L13.125 7.5"
                      stroke="#656E81"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </ListItemButton>
              </ListItem>
            </LightTooltip>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, px: 3 }}>
          {/* <DrawerHeader /> */}
          <Navigation />
          {/* <footer
            id="footer"
            style={{
              backgroundColor: "#F8F8F8",
              borderTop: "1px solid #E7E7E7",
              // textAlign: "center",
              padding: "0px 0px 0px 70px",
  
              position: "fixed",
              left: "0",
              bottom: "0",
              // height: "60px",
              width: "100%",
            }}
          >
            <Breadcrumbs
              aria-label="breadcrumb"
              separator="›"
              // className={classes.breadcrumbsStyle}
            >
              <Link to="/projects">Projects</Link>
              <Link to="/projects">International</Link>
  
              <Link to="#">VerifyMe Web</Link>
            </Breadcrumbs>
          </footer> */}
        </Box>
      </Box>
    );
  }
}
