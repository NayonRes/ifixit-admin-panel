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
import { Grid } from "@mui/material";
import { AuthContext } from "../../context/AuthContext";
import Collapse from "@mui/material/Collapse";
import { jwtDecode } from "jwt-decode";
import { useSnackbar } from "notistack";
import { ClearAllOutlined } from "@mui/icons-material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import RefreshToken from "../../services/RefreshToken";
import { handlePostData } from "../../services/PostDataService";

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
  let pathname = useLocation().pathname;
  const { ifixit_admin_panel, logout, login } = useContext(AuthContext);
  console.log("pathname", pathname);
  const [open, setOpen] = useState(true);
  const [cartsOpen, setCartsOpen] = useState(true);
  const [orderOpen, setOrderOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
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
    color: "#969696",
    ["& .MuiTypography-root"]: {
      fontSize: "16px",
      fontWeight: 500,
      color: "#969696",
    },
    "&:hover": {
      background: "#FAFAFA",
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

  useEffect(() => {}, []);

  const withoutLayout = ["/", "/forgot-password", "/reset-password", "/otp"];

  if (withoutLayout.includes(pathname)) {
    return <Navigation notificationCartName={notificationCartName} />;
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
                borderBottom: "1px solid #E5E5E5",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.125,
                  // mb: 2.5,
                }}
              >
                {open ? (
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs="auto" sx={{ position: "relative" }}>
                      <img
                        src="/logo.svg"
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
                    <Grid item xs="auto">
                      <IconButton onClick={() => handleDrawerOpen(!open)}>
                        <svg
                          width="23"
                          height="22"
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.972 13.75V8.25C20.972 3.66667 19.1387 1.83334 14.5553 1.83334H9.05534C4.47201 1.83334 2.63867 3.66667 2.63867 8.25V13.75C2.63867 18.3333 4.47201 20.1667 9.05534 20.1667H14.5553C19.1387 20.1667 20.972 18.3333 20.972 13.75Z"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.13867 1.83334V20.1667"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.5557 8.65334L12.209 11L14.5557 13.3467"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : (
                  <IconButton sx={{ ml: 1 }} onClick={() => setOpen(!open)}>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.139 13.7499V8.24992C20.139 3.66659 18.3057 1.83325 13.7223 1.83325H8.22233C3.639 1.83325 1.80566 3.66659 1.80566 8.24992V13.7499C1.80566 18.3333 3.639 20.1666 8.22233 20.1666H13.7223C18.3057 20.1666 20.139 18.3333 20.139 13.7499Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.7227 1.83325V20.1666"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.30566 8.65332L9.65233 11L7.30566 13.3467"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </IconButton>
                )}
              </Box>
              {/* <Divider sx={{ mb: 2.5 }} /> */}
            </ListItem>
            <Box
              className="sidebar"
              sx={{
                height: "Calc(100vh - 134px)",
                // background: "red",
                overflowY: "auto",
                pt: 2.5,
              }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
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
                      mr: open ? 1 : "auto",
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
                        d="M20.1667 9.99159V3.75825C20.1667 2.38325 19.58 1.83325 18.1225 1.83325H14.4192C12.9617 1.83325 12.375 2.38325 12.375 3.75825V9.99159C12.375 11.3666 12.9617 11.9166 14.4192 11.9166H18.1225C19.58 11.9166 20.1667 11.3666 20.1667 9.99159Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.1667 18.2417V16.5917C20.1667 15.2167 19.58 14.6667 18.1225 14.6667H14.4192C12.9617 14.6667 12.375 15.2167 12.375 16.5917V18.2417C12.375 19.6167 12.9617 20.1667 14.4192 20.1667H18.1225C19.58 20.1667 20.1667 19.6167 20.1667 18.2417Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.62467 12.0083V18.2416C9.62467 19.6166 9.03801 20.1666 7.58051 20.1666H3.87717C2.41967 20.1666 1.83301 19.6166 1.83301 18.2416V12.0083C1.83301 10.6333 2.41967 10.0833 3.87717 10.0833H7.58051C9.03801 10.0833 9.62467 10.6333 9.62467 12.0083Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.62467 3.75825V5.40825C9.62467 6.78325 9.03801 7.33325 7.58051 7.33325H3.87717C2.41967 7.33325 1.83301 6.78325 1.83301 5.40825V3.75825C1.83301 2.38325 2.41967 1.83325 3.87717 1.83325H7.58051C9.03801 1.83325 9.62467 2.38325 9.62467 3.75825Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <a
                  href="https://app.intercom.com/a/inbox/u5ngf0ay/inbox/admin"
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <ListItemButton
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
                        mr: open ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.416 8.25C16.416 11.7975 13.336 14.6667 9.54102 14.6667L8.68852 15.6933L8.18435 16.2984C7.75352 16.8117 6.92851 16.7017 6.64435 16.0875L5.41602 13.3833C3.74768 12.21 2.66602 10.3492 2.66602 8.25C2.66602 4.7025 5.74602 1.83333 9.54102 1.83333C12.3093 1.83333 14.7019 3.36417 15.7744 5.56417C16.1869 6.38 16.416 7.2875 16.416 8.25Z"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.9993 11.7883C20.9993 13.8875 19.9176 15.7484 18.2493 16.9217L17.021 19.6258C16.7368 20.24 15.9118 20.3592 15.481 19.8367L14.1243 18.205C11.906 18.205 9.92598 17.2242 8.68848 15.6933L9.54097 14.6667C13.336 14.6667 16.416 11.7975 16.416 8.25001C16.416 7.28751 16.1868 6.38001 15.7743 5.56418C18.7718 6.25168 20.9993 8.78166 20.9993 11.7883Z"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M7.25 8.25H11.8333"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primary="Live Chat"
                      sx={{ opacity: open ? 1 : 0 }}
                    />
                    {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                  </ListItemButton>
                </a>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/users"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/users" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8333 11C14.3646 11 16.4167 8.94798 16.4167 6.41668C16.4167 3.88537 14.3646 1.83334 11.8333 1.83334C9.30203 1.83334 7.25 3.88537 7.25 6.41668C7.25 8.94798 9.30203 11 11.8333 11Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.7073 20.1667C19.7073 16.6192 16.1781 13.75 11.8331 13.75C7.48815 13.75 3.95898 16.6192 3.95898 20.1667"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Users"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>

              <LightMenuTooltip
                // sx={{ fontSize: "16px" }}
                disableFocusListener={true}
                disableHoverListener={open}
                title={
                  <List sx={{ pl: 0, pt: 0, pb: 0, minWidth: "280px" }}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/live-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/live-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Live Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/approved-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/approved-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Approved Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/confirmed-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/confirmed-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Confirmed Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/review-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/review-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Review Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/rejected-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/rejected-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Rejected Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                  </List>
                  //   )
                }
                placement="right-start"
                TransitionComponent={Zoom}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    // component={Link}
                    // to="/carts"
                    sx={[
                      { ...listButtonStyle },
                      // pathname === "/carts" && { ...activeStyle },
                    ]}
                    onClick={handleCartOpen}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.66602 3.66666L4.64457 4.31476C5.3798 4.5556 5.92203 5.17241 6.05768 5.92223L7.21896 12.3414C7.39837 13.3331 8.27573 14.0555 9.30069 14.0555H17.3566C18.2984 14.0555 19.1266 13.4435 19.3879 12.5544L20.915 7.35999C21.3056 6.03135 20.291 4.70555 18.8837 4.70555H9.00912M10.0663 17.6917C10.0663 18.5523 9.35632 19.25 8.48052 19.25C7.60473 19.25 6.89475 18.5523 6.89475 17.6917C6.89475 16.831 7.60473 16.1333 8.48052 16.1333C9.35632 16.1333 10.0663 16.831 10.0663 17.6917ZM18.5238 17.6917C18.5238 18.5523 17.8138 19.25 16.938 19.25C16.0622 19.25 15.3522 18.5523 15.3522 17.6917C15.3522 16.831 16.0622 16.1333 16.938 16.1333C17.8138 16.1333 18.5238 16.831 18.5238 17.6917Z"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primary="Carts"
                      sx={{ opacity: open ? 1 : 0 }}
                    />

                    {cartsOpen ? (
                      <svg
                        width="17"
                        height="9"
                        viewBox="0 0 17 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0932 7.79575L10.1166 1.81908C9.41074 1.11325 8.25574 1.11325 7.54991 1.81908L1.57324 7.79575"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="9"
                        viewBox="0 0 16 9"
                        fill="none"
                      >
                        <path
                          d="M15.2602 1.2041L9.28357 7.18077C8.57773 7.8866 7.42273 7.8866 6.7169 7.18077L0.740234 1.2041"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </ListItemButton>
                </ListItem>
              </LightMenuTooltip>
              <Collapse in={cartsOpen}>
                <List sx={{ pl: 0, pt: 0 }}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/live-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/live-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Live Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/approved-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/approved-carts" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Approved Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/confirmed-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/confirmed-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Confirmed Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/review-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/review-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Review Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/rejected-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/rejected-carts" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Rejected Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              <LightMenuTooltip
                // sx={{ fontSize: "16px" }}
                disableFocusListener={true}
                disableHoverListener={open}
                title={
                  <List sx={{ pl: 0, pt: 0, pb: 0, minWidth: "280px" }}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/live-order-list"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/live-order-list" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Live Order List"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/delivered-order-list"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/delivered-order-list" && {
                            ...activeStyle,
                          },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Delivered Order List"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        {/* 5 */}
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/canceled-order-list"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/canceled-order-list" && {
                            ...activeStyle,
                          },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Canceled Order List"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                  //   )
                }
                placement="right-start"
                TransitionComponent={Zoom}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    // component={Link}
                    // to="/carts"
                    sx={[
                      { ...listButtonStyle },
                      // pathname === "/carts" && { ...activeStyle },
                    ]}
                    onClick={handleOrderOpen}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.16602 11.1833H14.5827"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M8.16602 14.85H12.181"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.99935 5.50001H13.666C15.4993 5.50001 15.4993 4.58334 15.4993 3.66668C15.4993 1.83334 14.5827 1.83334 13.666 1.83334H9.99935C9.08268 1.83334 8.16602 1.83334 8.16602 3.66668C8.16602 5.50001 9.08268 5.50001 9.99935 5.50001Z"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M15.4997 3.685C18.5522 3.85 20.083 4.9775 20.083 9.16666V14.6667C20.083 18.3333 19.1663 20.1667 14.583 20.1667H9.08301C4.49967 20.1667 3.58301 18.3333 3.58301 14.6667V9.16666C3.58301 4.98666 5.11384 3.85 8.16634 3.685"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primary="Orders"
                      sx={{ opacity: open ? 1 : 0 }}
                    />

                    {orderOpen ? (
                      <svg
                        width="17"
                        height="9"
                        viewBox="0 0 17 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0932 7.79575L10.1166 1.81908C9.41074 1.11325 8.25574 1.11325 7.54991 1.81908L1.57324 7.79575"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="9"
                        viewBox="0 0 16 9"
                        fill="none"
                      >
                        <path
                          d="M15.2602 1.2041L9.28357 7.18077C8.57773 7.8866 7.42273 7.8866 6.7169 7.18077L0.740234 1.2041"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </ListItemButton>
                </ListItem>
              </LightMenuTooltip>
              <Collapse in={orderOpen}>
                <List sx={{ pl: 0, pt: 0 }}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/live-order-list"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/live-order-list" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Live Order List"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>

                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/delivered-order-list"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/delivered-order-list" && {
                          ...activeStyle,
                        },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Delivered Order List"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/canceled-order-list"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/canceled-order-list" && {
                          ...activeStyle,
                        },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Canceled Order List"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {/* 5 */}
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              {/* <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/case-tickets"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/case-tickets" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
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
                        d="M13.0348 8.96516L10.9998 9.98266M10.9998 9.98266L8.96475 8.96516M10.9998 9.98266V12.531M19.1489 5.9035L17.1139 6.921M19.1489 5.9035L17.1139 4.886M19.1489 5.9035V8.45183M2.85059 5.9035L4.88559 4.886M2.85059 5.9035L4.88559 6.921M2.85059 5.9035V8.45183M10.9998 20.1668L8.96475 19.1493M10.9998 20.1668L13.0348 19.1493M10.9998 20.1668V17.6185M13.0348 2.851L10.9998 1.8335L8.96475 2.851H13.0348ZM4.88559 17.1143L2.85059 16.0968V13.5485L4.88559 17.1143ZM17.1139 17.1143L19.1489 16.0968V13.5485L17.1139 17.1143Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Case Tickets"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5
                </ListItemButton>
              </ListItem> */}
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/delivery-list"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/delivery-list" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8329 12.8333H12.7496C13.7579 12.8333 14.5829 12.0083 14.5829 11V1.83331H6.33295C4.95795 1.83331 3.75712 2.59414 3.13379 3.71247"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 15.5833C2.66602 17.105 3.89435 18.3333 5.41602 18.3333H6.33268C6.33268 17.325 7.15768 16.5 8.16602 16.5C9.17435 16.5 9.99935 17.325 9.99935 18.3333H13.666C13.666 17.325 14.491 16.5 15.4993 16.5C16.5077 16.5 17.3327 17.325 17.3327 18.3333H18.2493C19.771 18.3333 20.9993 17.105 20.9993 15.5833V12.8333H18.2493C17.7452 12.8333 17.3327 12.4208 17.3327 11.9166V9.16665C17.3327 8.66248 17.7452 8.24998 18.2493 8.24998H19.4318L17.8644 5.50916C17.5344 4.94082 16.9294 4.58331 16.2694 4.58331H14.5827V11C14.5827 12.0083 13.7577 12.8333 12.7493 12.8333H11.8327"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.16634 20.1667C9.17886 20.1667 9.99967 19.3459 9.99967 18.3333C9.99967 17.3208 9.17886 16.5 8.16634 16.5C7.15382 16.5 6.33301 17.3208 6.33301 18.3333C6.33301 19.3459 7.15382 20.1667 8.16634 20.1667Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.4993 20.1667C16.5119 20.1667 17.3327 19.3459 17.3327 18.3333C17.3327 17.3208 16.5119 16.5 15.4993 16.5C14.4868 16.5 13.666 17.3208 13.666 18.3333C13.666 19.3459 14.4868 20.1667 15.4993 20.1667Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.9997 11V12.8333H18.2497C17.7455 12.8333 17.333 12.4208 17.333 11.9167V9.16667C17.333 8.6625 17.7455 8.25 18.2497 8.25H19.4322L20.9997 11Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 7.33331H8.16602"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 10.0833H6.33268"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 12.8333H4.49935"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Delivery List"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>

              {ifixit_admin_panel.token &&
                jwtDecode(
                  ifixit_admin_panel.token
                )?.realm_access.roles.includes("CAN_DO_ALL") && (
                  <>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
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
                            mr: open ? 1 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.3701 8.88H17.6201"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.37988 8.88L7.12988 9.63L9.37988 7.38"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M12.3701 15.88H17.6201"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M6.37988 15.88L7.12988 16.63L9.37988 14.38"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Product Showcase"
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/admin-list"
                        sx={[
                          { ...listButtonStyle },
                          pathname === "/admin-list" && { ...activeStyle },
                        ]}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 1 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M9.16006 10.87C9.06006 10.86 8.94006 10.86 8.83006 10.87C6.45006 10.79 4.56006 8.84 4.56006 6.44C4.56006 3.99 6.54006 2 9.00006 2C11.4501 2 13.4401 3.99 13.4401 6.44C13.4301 8.84 11.5401 10.79 9.16006 10.87Z"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M4.15997 14.56C1.73997 16.18 1.73997 18.82 4.15997 20.43C6.90997 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.91997 12.73 4.15997 14.56Z"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M18.3401 20C19.0601 19.85 19.7401 19.56 20.3001 19.13C21.8601 17.96 21.8601 16.03 20.3001 14.86C19.7501 14.44 19.0801 14.16 18.3701 14"
                              stroke="#555555"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Admin Management"
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>

                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/activity-log"
                        sx={[
                          { ...listButtonStyle },
                          pathname === "/activity-log" && { ...activeStyle },
                        ]}
                      >
                        <ListItemIcon
                          sx={{
                            minWidth: 0,
                            mr: open ? 1 : "auto",
                            justifyContent: "center",
                          }}
                        >
                          <svg
                            width="22"
                            height="23"
                            viewBox="0 0 22 23"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M20.1663 11.2897C20.1663 16.3497 16.0597 20.4564 10.9997 20.4564C5.93967 20.4564 1.83301 16.3497 1.83301 11.2897C1.83301 6.22971 5.93967 2.12305 10.9997 2.12305C16.0597 2.12305 20.1663 6.22971 20.1663 11.2897Z"
                              stroke="#969696"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                            <path
                              d="M14.4011 14.2047L11.5595 12.5088C11.0645 12.2155 10.6611 11.5097 10.6611 10.9322V7.17383"
                              stroke="#969696"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Activity Log"
                          sx={{ opacity: open ? 1 : 0 }}
                        />
                      </ListItemButton>
                    </ListItem>

                    <LightMenuTooltip
                      // sx={{ fontSize: "16px" }}
                      disableFocusListener={true}
                      disableHoverListener={open}
                      title={
                        <List sx={{ pl: 0, pt: 0, pb: 0, minWidth: "280px" }}>
                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/currency-conversion"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname === "/currency-conversion" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Currency Conversion"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/cart-validity-time"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname === "/cart-validity-time" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Cart Validity Time"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                              {/* 5 */}
                            </ListItemButton>
                          </ListItem>

                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/delivery-invoice-configuration"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname ===
                                  "/delivery-invoice-configuration" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Delivery Invoice Configuration"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                              {/* 5 */}
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/manage-order-status"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname === "/manage-order-status" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Manage Order Status"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                              {/* 5 */}
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/manage-payment-method"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname === "/manage-payment-method" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Manage Payment Method"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                              {/* 5 */}
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding sx={{ display: "block" }}>
                            <ListItemButton
                              component={Link}
                              to="/unmark-order"
                              sx={[
                                { ...listButtonStyle },
                                { mr: 0, ml: 0 },
                                pathname === "/unmark-order" && {
                                  ...activeStyle,
                                },
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
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                    stroke="#969696"
                                    stroke-width="1.5"
                                  />
                                </svg>
                              </ListItemIcon>
                              <ListItemText
                                primary="Unmark Order"
                                // sx={{ opacity: open ? 1 : 0 }}
                              />
                              {/* 5 */}
                            </ListItemButton>
                          </ListItem>
                        </List>
                        //   )
                      }
                      placement="right-start"
                      TransitionComponent={Zoom}
                    >
                      <ListItem disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                          component={Link}
                          // to="/settings"
                          sx={[
                            { ...listButtonStyle },
                            // pathname === "/settings" && { ...activeStyle },
                          ]}
                          onClick={handleSettingsOpen}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: open ? 1 : "auto",
                              justifyContent: "center",
                            }}
                          >
                            <svg
                              width="23"
                              height="22"
                              viewBox="0 0 23 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.833 13.75C13.3518 13.75 14.583 12.5188 14.583 11C14.583 9.48122 13.3518 8.25 11.833 8.25C10.3142 8.25 9.08301 9.48122 9.08301 11C9.08301 12.5188 10.3142 13.75 11.833 13.75Z"
                                stroke="#969696"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M2.66602 11.8066V10.1933C2.66602 9.23998 3.44518 8.45165 4.40768 8.45165C6.06685 8.45165 6.74518 7.27832 5.91102 5.83915C5.43435 5.01415 5.71852 3.94165 6.55268 3.46498L8.13851 2.55748C8.86268 2.12665 9.79768 2.38332 10.2285 3.10748L10.3293 3.28165C11.1543 4.72082 12.511 4.72082 13.3452 3.28165L13.446 3.10748C13.8768 2.38332 14.8118 2.12665 15.536 2.55748L17.1218 3.46498C17.956 3.94165 18.2402 5.01415 17.7635 5.83915C16.9293 7.27832 17.6077 8.45165 19.2668 8.45165C20.2202 8.45165 21.0085 9.23082 21.0085 10.1933V11.8066C21.0085 12.76 20.2293 13.5483 19.2668 13.5483C17.6077 13.5483 16.9293 14.7216 17.7635 16.1608C18.2402 16.995 17.956 18.0583 17.1218 18.535L15.536 19.4425C14.8118 19.8733 13.8768 19.6166 13.446 18.8925L13.3452 18.7183C12.5202 17.2791 11.1635 17.2791 10.3293 18.7183L10.2285 18.8925C9.79768 19.6166 8.86268 19.8733 8.13851 19.4425L6.55268 18.535C5.71852 18.0583 5.43435 16.9858 5.91102 16.1608C6.74518 14.7216 6.06685 13.5483 4.40768 13.5483C3.44518 13.5483 2.66602 12.76 2.66602 11.8066Z"
                                stroke="#969696"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </ListItemIcon>
                          <ListItemText
                            primary="Settings"
                            sx={{ opacity: open ? 1 : 0 }}
                          />

                          {settingsOpen ? (
                            <svg
                              width="17"
                              height="9"
                              viewBox="0 0 17 9"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M16.0932 7.79575L10.1166 1.81908C9.41074 1.11325 8.25574 1.11325 7.54991 1.81908L1.57324 7.79575"
                                stroke="#969696"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="9"
                              viewBox="0 0 16 9"
                              fill="none"
                            >
                              <path
                                d="M15.2602 1.2041L9.28357 7.18077C8.57773 7.8866 7.42273 7.8866 6.7169 7.18077L0.740234 1.2041"
                                stroke="#969696"
                                stroke-width="1.5"
                                stroke-miterlimit="10"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          )}
                        </ListItemButton>
                      </ListItem>
                    </LightMenuTooltip>
                    <Collapse in={settingsOpen}>
                      <List sx={{ pl: 0, pt: 0 }}>
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/currency-conversion"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/currency-conversion" && {
                                ...activeStyle,
                              },
                            ]}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Currency Conversion"
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                            {/* 5 */}
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/cart-validity-time"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/cart-validity-time" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Cart Validity Time"
                              sx={{ opacity: open ? 1 : 0 }}
                            />
                            {/* 5 */}
                          </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/delivery-invoice-configuration"
                            sx={[
                              { ...listButtonStyle },
                              pathname ===
                                "/delivery-invoice-configuration" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Delivery Invoice Configuration"
                              sx={{ opacity: open ? 1 : 0, whiteSpace: "wrap" }}
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/manage-order-status"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/manage-order-status" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Manage Order Status"
                              sx={{ opacity: open ? 1 : 0, whiteSpace: "wrap" }}
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/manage-payment-method"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/manage-payment-method" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Manage Payment Method"
                              sx={{ opacity: open ? 1 : 0, whiteSpace: "wrap" }}
                            />
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding sx={{ display: "block" }}>
                          <ListItemButton
                            component={Link}
                            to="/unmark-order"
                            sx={[
                              { ...listButtonStyle },
                              pathname === "/unmark-order" && {
                                ...activeStyle,
                              },
                            ]}
                            style={{ marginBottom: "0px" }}
                          >
                            <ListItemIcon
                              sx={{
                                minWidth: 0,
                                mr: open ? 1 : "auto",
                                justifyContent: "center",
                              }}
                            >
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                                  stroke="#969696"
                                  stroke-width="1.5"
                                />
                              </svg>
                            </ListItemIcon>
                            <ListItemText
                              primary="Unmark Order"
                              sx={{ opacity: open ? 1 : 0, whiteSpace: "wrap" }}
                            />
                          </ListItemButton>
                        </ListItem>
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
                  {/* <ListItem disablePadding sx={{ display: "block" }}>
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
                        // sx={{ opacity: open ? 1 : 0 }}
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
                        // sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem> */}
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      onClick={() => logout()}
                      sx={[
                        { ...listButtonStyle },
                        {
                          mr: 0,
                          ml: 0,
                          ["& .MuiTypography-root"]: {
                            color: "#fff",
                          },
                        },
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
                        // sx={{ opacity: open ? 1 : 0 }}
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
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/user.png"
                      alt="avatar"
                      width="28px"
                      height="28px"
                      // style={{ position: "relative", left: 7 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      ifixit_admin_panel.token &&
                      jwtDecode(ifixit_admin_panel.token)?.name
                    }
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </LightTooltip>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* <DrawerHeader /> */}
          <Navigation notificationCartName={notificationCartName} />
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
                borderBottom: "1px solid #E5E5E5",
              }}
            >
              <Box
                sx={{
                  px: 2,
                  py: 1.125,
                  // mb: 2.5,
                }}
              >
                {open ? (
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid item xs="auto" sx={{ position: "relative" }}>
                      <img
                        src="/logo.svg"
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
                    <Grid item xs="auto">
                      <IconButton onClick={() => handleDrawerOpen(!open)}>
                        <svg
                          width="23"
                          height="22"
                          viewBox="0 0 23 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.972 13.75V8.25C20.972 3.66667 19.1387 1.83334 14.5553 1.83334H9.05534C4.47201 1.83334 2.63867 3.66667 2.63867 8.25V13.75C2.63867 18.3333 4.47201 20.1667 9.05534 20.1667H14.5553C19.1387 20.1667 20.972 18.3333 20.972 13.75Z"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8.13867 1.83334V20.1667"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M14.5557 8.65334L12.209 11L14.5557 13.3467"
                            stroke="#969696"
                            stroke-width="1.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </IconButton>
                    </Grid>
                  </Grid>
                ) : (
                  <IconButton sx={{ ml: 1 }} onClick={() => setOpen(!open)}>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.139 13.7499V8.24992C20.139 3.66659 18.3057 1.83325 13.7223 1.83325H8.22233C3.639 1.83325 1.80566 3.66659 1.80566 8.24992V13.7499C1.80566 18.3333 3.639 20.1666 8.22233 20.1666H13.7223C18.3057 20.1666 20.139 18.3333 20.139 13.7499Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.7227 1.83325V20.1666"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.30566 8.65332L9.65233 11L7.30566 13.3467"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </IconButton>
                )}
              </Box>
              {/* <Divider sx={{ mb: 2.5 }} /> */}
            </ListItem>
            <Box
              className="sidebar"
              sx={{
                height: "Calc(100vh - 134px)",
                // background: "red",
                overflowY: "auto",
                pt: 2.5,
              }}
            >
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
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
                      mr: open ? 1 : "auto",
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
                        d="M20.1667 9.99159V3.75825C20.1667 2.38325 19.58 1.83325 18.1225 1.83325H14.4192C12.9617 1.83325 12.375 2.38325 12.375 3.75825V9.99159C12.375 11.3666 12.9617 11.9166 14.4192 11.9166H18.1225C19.58 11.9166 20.1667 11.3666 20.1667 9.99159Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.1667 18.2417V16.5917C20.1667 15.2167 19.58 14.6667 18.1225 14.6667H14.4192C12.9617 14.6667 12.375 15.2167 12.375 16.5917V18.2417C12.375 19.6167 12.9617 20.1667 14.4192 20.1667H18.1225C19.58 20.1667 20.1667 19.6167 20.1667 18.2417Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.62467 12.0083V18.2416C9.62467 19.6166 9.03801 20.1666 7.58051 20.1666H3.87717C2.41967 20.1666 1.83301 19.6166 1.83301 18.2416V12.0083C1.83301 10.6333 2.41967 10.0833 3.87717 10.0833H7.58051C9.03801 10.0833 9.62467 10.6333 9.62467 12.0083Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.62467 3.75825V5.40825C9.62467 6.78325 9.03801 7.33325 7.58051 7.33325H3.87717C2.41967 7.33325 1.83301 6.78325 1.83301 5.40825V3.75825C1.83301 2.38325 2.41967 1.83325 3.87717 1.83325H7.58051C9.03801 1.83325 9.62467 2.38325 9.62467 3.75825Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Dashboard"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
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
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.416 8.25C16.416 11.7975 13.336 14.6667 9.54102 14.6667L8.68852 15.6933L8.18435 16.2984C7.75352 16.8117 6.92851 16.7017 6.64435 16.0875L5.41602 13.3833C3.74768 12.21 2.66602 10.3492 2.66602 8.25C2.66602 4.7025 5.74602 1.83333 9.54102 1.83333C12.3093 1.83333 14.7019 3.36417 15.7744 5.56417C16.1869 6.38 16.416 7.2875 16.416 8.25Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.9993 11.7883C20.9993 13.8875 19.9176 15.7484 18.2493 16.9217L17.021 19.6258C16.7368 20.24 15.9118 20.3592 15.481 19.8367L14.1243 18.205C11.906 18.205 9.92598 17.2242 8.68848 15.6933L9.54097 14.6667C13.336 14.6667 16.416 11.7975 16.416 8.25001C16.416 7.28751 16.1868 6.38001 15.7743 5.56418C18.7718 6.25168 20.9993 8.78166 20.9993 11.7883Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M7.25 8.25H11.8333"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Live Chat"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/users"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/users" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8333 11C14.3646 11 16.4167 8.94798 16.4167 6.41668C16.4167 3.88537 14.3646 1.83334 11.8333 1.83334C9.30203 1.83334 7.25 3.88537 7.25 6.41668C7.25 8.94798 9.30203 11 11.8333 11Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M19.7073 20.1667C19.7073 16.6192 16.1781 13.75 11.8331 13.75C7.48815 13.75 3.95898 16.6192 3.95898 20.1667"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Users"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/orders"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/orders" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.16602 11.1833H14.5827"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.16602 14.85H12.181"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M9.99935 5.50001H13.666C15.4993 5.50001 15.4993 4.58334 15.4993 3.66668C15.4993 1.83334 14.5827 1.83334 13.666 1.83334H9.99935C9.08268 1.83334 8.16602 1.83334 8.16602 3.66668C8.16602 5.50001 9.08268 5.50001 9.99935 5.50001Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.4997 3.685C18.5522 3.85 20.083 4.9775 20.083 9.16666V14.6667C20.083 18.3333 19.1663 20.1667 14.583 20.1667H9.08301C4.49967 20.1667 3.58301 18.3333 3.58301 14.6667V9.16666C3.58301 4.98666 5.11384 3.85 8.16634 3.685"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Orders"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <LightMenuTooltip
                // sx={{ fontSize: "16px" }}
                disableFocusListener={true}
                disableHoverListener={open}
                title={
                  <List sx={{ pl: 0, pt: 0, pb: 0, minWidth: "280px" }}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/live-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/live-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Live Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/approved-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/approved-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Approved Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/confirmed-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/confirmed-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Confirmed Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/review-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/review-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Review Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/rejected-carts"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/rejected-carts" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Rejected Carts"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                  </List>
                  //   )
                }
                placement="right-start"
                TransitionComponent={Zoom}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    // component={Link}
                    // to="/carts"
                    sx={[
                      { ...listButtonStyle },
                      // pathname === "/carts" && { ...activeStyle },
                    ]}
                    onClick={handleCartOpen}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : "auto",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="23"
                        height="22"
                        viewBox="0 0 23 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.66602 3.66666L4.64457 4.31476C5.3798 4.5556 5.92203 5.17241 6.05768 5.92223L7.21896 12.3414C7.39837 13.3331 8.27573 14.0555 9.30069 14.0555H17.3566C18.2984 14.0555 19.1266 13.4435 19.3879 12.5544L20.915 7.35999C21.3056 6.03135 20.291 4.70555 18.8837 4.70555H9.00912M10.0663 17.6917C10.0663 18.5523 9.35632 19.25 8.48052 19.25C7.60473 19.25 6.89475 18.5523 6.89475 17.6917C6.89475 16.831 7.60473 16.1333 8.48052 16.1333C9.35632 16.1333 10.0663 16.831 10.0663 17.6917ZM18.5238 17.6917C18.5238 18.5523 17.8138 19.25 16.938 19.25C16.0622 19.25 15.3522 18.5523 15.3522 17.6917C15.3522 16.831 16.0622 16.1333 16.938 16.1333C17.8138 16.1333 18.5238 16.831 18.5238 17.6917Z"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primary="Carts"
                      sx={{ opacity: open ? 1 : 0 }}
                    />

                    {cartsOpen ? (
                      <svg
                        width="17"
                        height="9"
                        viewBox="0 0 17 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0932 7.79575L10.1166 1.81908C9.41074 1.11325 8.25574 1.11325 7.54991 1.81908L1.57324 7.79575"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="9"
                        viewBox="0 0 16 9"
                        fill="none"
                      >
                        <path
                          d="M15.2602 1.2041L9.28357 7.18077C8.57773 7.8866 7.42273 7.8866 6.7169 7.18077L0.740234 1.2041"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </ListItemButton>
                </ListItem>
              </LightMenuTooltip>
              <Collapse in={cartsOpen}>
                <List sx={{ pl: 0, pt: 0 }}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/live-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/live-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Live Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/approved-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/approved-carts" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Approved Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/confirmed-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/confirmed-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Confirmed Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/review-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/review-carts" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Review Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/rejected-carts"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/rejected-carts" && { ...activeStyle },
                      ]}
                      style={{ marginBottom: "0px" }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Rejected Carts"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/case-tickets"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/case-tickets" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
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
                        d="M13.0348 8.96516L10.9998 9.98266M10.9998 9.98266L8.96475 8.96516M10.9998 9.98266V12.531M19.1489 5.9035L17.1139 6.921M19.1489 5.9035L17.1139 4.886M19.1489 5.9035V8.45183M2.85059 5.9035L4.88559 4.886M2.85059 5.9035L4.88559 6.921M2.85059 5.9035V8.45183M10.9998 20.1668L8.96475 19.1493M10.9998 20.1668L13.0348 19.1493M10.9998 20.1668V17.6185M13.0348 2.851L10.9998 1.8335L8.96475 2.851H13.0348ZM4.88559 17.1143L2.85059 16.0968V13.5485L4.88559 17.1143ZM17.1139 17.1143L19.1489 16.0968V13.5485L17.1139 17.1143Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Case Tickets"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                  {/* &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp; 5 */}
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/delivery-list"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/delivery-list" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.8329 12.8333H12.7496C13.7579 12.8333 14.5829 12.0083 14.5829 11V1.83331H6.33295C4.95795 1.83331 3.75712 2.59414 3.13379 3.71247"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 15.5833C2.66602 17.105 3.89435 18.3333 5.41602 18.3333H6.33268C6.33268 17.325 7.15768 16.5 8.16602 16.5C9.17435 16.5 9.99935 17.325 9.99935 18.3333H13.666C13.666 17.325 14.491 16.5 15.4993 16.5C16.5077 16.5 17.3327 17.325 17.3327 18.3333H18.2493C19.771 18.3333 20.9993 17.105 20.9993 15.5833V12.8333H18.2493C17.7452 12.8333 17.3327 12.4208 17.3327 11.9166V9.16665C17.3327 8.66248 17.7452 8.24998 18.2493 8.24998H19.4318L17.8644 5.50916C17.5344 4.94082 16.9294 4.58331 16.2694 4.58331H14.5827V11C14.5827 12.0083 13.7577 12.8333 12.7493 12.8333H11.8327"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M8.16634 20.1667C9.17886 20.1667 9.99967 19.3459 9.99967 18.3333C9.99967 17.3208 9.17886 16.5 8.16634 16.5C7.15382 16.5 6.33301 17.3208 6.33301 18.3333C6.33301 19.3459 7.15382 20.1667 8.16634 20.1667Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M15.4993 20.1667C16.5119 20.1667 17.3327 19.3459 17.3327 18.3333C17.3327 17.3208 16.5119 16.5 15.4993 16.5C14.4868 16.5 13.666 17.3208 13.666 18.3333C13.666 19.3459 14.4868 20.1667 15.4993 20.1667Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M20.9997 11V12.8333H18.2497C17.7455 12.8333 17.333 12.4208 17.333 11.9167V9.16667C17.333 8.6625 17.7455 8.25 18.2497 8.25H19.4322L20.9997 11Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 7.33331H8.16602"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 10.0833H6.33268"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 12.8333H4.49935"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Delivery List"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
              <LightMenuTooltip
                // sx={{ fontSize: "16px" }}
                disableFocusListener={true}
                disableHoverListener={open}
                title={
                  <List sx={{ pl: 0, pt: 0, pb: 0, minWidth: "280px" }}>
                    <ListItem disablePadding sx={{ display: "block" }}>
                      <ListItemButton
                        component={Link}
                        to="/accounting"
                        sx={[
                          { ...listButtonStyle },
                          { mr: 0, ml: 0 },
                          pathname === "/accounting" && { ...activeStyle },
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
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                              stroke="#969696"
                              stroke-width="1.5"
                            />
                          </svg>
                        </ListItemIcon>
                        <ListItemText
                          primary="Accounting"
                          // sx={{ opacity: open ? 1 : 0 }}
                        />
                        5
                      </ListItemButton>
                    </ListItem>
                  </List>
                  //   )
                }
                placement="right-start"
                TransitionComponent={Zoom}
              >
                <ListItem disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    // component={Link}
                    // to="/carts"
                    sx={[
                      { ...listButtonStyle },
                      // pathname === "/carts" && { ...activeStyle },
                    ]}
                    onClick={handlePaymentOpen}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1 : "auto",
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
                          d="M1.83301 7.7915H12.3747"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M5.5 15.125H7.33333"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M9.625 15.125H13.2917"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M20.1663 10.111V14.7677C20.1663 17.9852 19.3505 18.7918 16.0963 18.7918H5.90301C2.64884 18.7918 1.83301 17.9852 1.83301 14.7677V7.23266C1.83301 4.01516 2.64884 3.2085 5.90301 3.2085H12.3747"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                        <path
                          d="M15.125 5.50016L16.5 6.87516L20.1667 3.2085"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </ListItemIcon>
                    <ListItemText
                      primary="Payments"
                      sx={{ opacity: open ? 1 : 0 }}
                    />

                    {paymentOpen ? (
                      <svg
                        width="17"
                        height="9"
                        viewBox="0 0 17 9"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.0932 7.79575L10.1166 1.81908C9.41074 1.11325 8.25574 1.11325 7.54991 1.81908L1.57324 7.79575"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="9"
                        viewBox="0 0 16 9"
                        fill="none"
                      >
                        <path
                          d="M15.2602 1.2041L9.28357 7.18077C8.57773 7.8866 7.42273 7.8866 6.7169 7.18077L0.740234 1.2041"
                          stroke="#969696"
                          stroke-width="1.5"
                          stroke-miterlimit="10"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </ListItemButton>
                </ListItem>
              </LightMenuTooltip>
              <Collapse in={paymentOpen}>
                <List sx={{ pl: 0, pt: 0 }}>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/accounting"
                      sx={[
                        { ...listButtonStyle },
                        pathname === "/accounting" && { ...activeStyle },
                      ]}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 1 : "auto",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5968 7.00005C11.5968 9.53903 9.53854 11.5973 6.99957 11.5973C4.46059 11.5973 2.40234 9.53903 2.40234 7.00005C2.40234 4.46108 4.46059 2.40283 6.99957 2.40283C9.53854 2.40283 11.5968 4.46108 11.5968 7.00005Z"
                            stroke="#969696"
                            stroke-width="1.5"
                          />
                        </svg>
                      </ListItemIcon>
                      <ListItemText
                        primary="Accounting"
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      5
                    </ListItemButton>
                  </ListItem>
                </List>
              </Collapse>
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/email"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/email" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.416 18.7916H7.24935C4.49935 18.7916 2.66602 17.4166 2.66602 14.2083V7.79165C2.66602 4.58331 4.49935 3.20831 7.24935 3.20831H16.416C19.166 3.20831 20.9993 4.58331 20.9993 7.79165V14.2083C20.9993 17.4166 19.166 18.7916 16.416 18.7916Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M16.4167 8.25L13.5475 10.5417C12.6033 11.2933 11.0542 11.2933 10.11 10.5417L7.25 8.25"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Email"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  component={Link}
                  to="/settings"
                  sx={[
                    { ...listButtonStyle },
                    pathname === "/settings" && { ...activeStyle },
                  ]}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="23"
                      height="22"
                      viewBox="0 0 23 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.833 13.75C13.3518 13.75 14.583 12.5188 14.583 11C14.583 9.48122 13.3518 8.25 11.833 8.25C10.3142 8.25 9.08301 9.48122 9.08301 11C9.08301 12.5188 10.3142 13.75 11.833 13.75Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M2.66602 11.8066V10.1933C2.66602 9.23998 3.44518 8.45165 4.40768 8.45165C6.06685 8.45165 6.74518 7.27832 5.91102 5.83915C5.43435 5.01415 5.71852 3.94165 6.55268 3.46498L8.13851 2.55748C8.86268 2.12665 9.79768 2.38332 10.2285 3.10748L10.3293 3.28165C11.1543 4.72082 12.511 4.72082 13.3452 3.28165L13.446 3.10748C13.8768 2.38332 14.8118 2.12665 15.536 2.55748L17.1218 3.46498C17.956 3.94165 18.2402 5.01415 17.7635 5.83915C16.9293 7.27832 17.6077 8.45165 19.2668 8.45165C20.2202 8.45165 21.0085 9.23082 21.0085 10.1933V11.8066C21.0085 12.76 20.2293 13.5483 19.2668 13.5483C17.6077 13.5483 16.9293 14.7216 17.7635 16.1608C18.2402 16.995 17.956 18.0583 17.1218 18.535L15.536 19.4425C14.8118 19.8733 13.8768 19.6166 13.446 18.8925L13.3452 18.7183C12.5202 17.2791 11.1635 17.2791 10.3293 18.7183L10.2285 18.8925C9.79768 19.6166 8.86268 19.8733 8.13851 19.4425L6.55268 18.535C5.71852 18.0583 5.43435 16.9858 5.91102 16.1608C6.74518 14.7216 6.06685 13.5483 4.40768 13.5483C3.44518 13.5483 2.66602 12.76 2.66602 11.8066Z"
                        stroke="#969696"
                        stroke-width="1.5"
                        stroke-miterlimit="10"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </ListItemIcon>
                  <ListItemText
                    primary="Settings"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
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
                        // sx={{ opacity: open ? 1 : 0 }}
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
                        // sx={{ opacity: open ? 1 : 0 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding sx={{ display: "block" }}>
                    <ListItemButton
                      component={Link}
                      to="/logout"
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
                        // sx={{ opacity: open ? 1 : 0 }}
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
                      mr: open ? 1 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="/user.png"
                      alt="avatar"
                      width="28px"
                      height="28px"
                      // style={{ position: "relative", left: 7 }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="Jone Doe"
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            </LightTooltip>
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1 }}>
          {/* <DrawerHeader /> */}
          <Navigation notificationCartName={notificationCartName} />
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
