import Icon from "@mui/material/Icon";
import { Category, Dvr, Engineering, FormatListBulleted, Person, PrecisionManufacturing, ShoppingCart, Store } from "@mui/icons-material";
import ProviderScreen from "memps_components/ProviderComponents/providerScreen";
import { ProviderSummary } from "memps_components/ProviderComponents/providerSummary";
import EquipmentScreen from "memps_components/EquipmentComponents/equipmentScreen";
import MaintenanceScreen from "memps_components/MaintenanceComponents/MaintenanceScreen";
import { MaintenanceSummary } from "memps_components/MaintenanceComponents/MaintenanceSummary";
import OrderScreen from "memps_components/OrderComponents/OrderScreen";
import UsageLogScreen from "memps_components/UsageLogsComponents/UsageLogScreen";
import { TechnicianScreen } from "memps_components/TechnicianComponents/technicianScreen";
import { EquipmentSummary } from "memps_components/EquipmentComponents/equipmentSummary";
import { OrderSummary } from "memps_components/OrderComponents/OrderSummary";
import LoginPage from "memps_components/Login/loginPage";
import UserScreen from "memps_components/UserComponents/userScreen";
import CatalogScreen from "memps_components/CatalogScreen/catalogScreen";
import LookupScreen from "memps_components/LookupScreen/lookupScreen";

const routes = [
  {
    type: "navitem",
    name: "Equipment",
    key: "equipment",
    icon: <Icon fontSize="small"><PrecisionManufacturing/></Icon>,
    route: "/equipment",
    component: <EquipmentScreen/>,
    role: "HOSPITAL"
  },
  {
    type: "navitem",
    name: "Orders",
    key: "orders",
    icon: <Icon fontSize="small"><ShoppingCart/></Icon>,
    route: "/orders",
    component: <OrderScreen/>,
    role: "SUPPLIER,HOSPITAL"
  },
  {
    type: "navitem",
    name: "Maintenance",
    key: "maintenance",
    icon: <Icon fontSize="small"><Engineering/></Icon>,
    route: "/maintenance",
    component: <MaintenanceScreen />,
    role: "SUPPLIER,HOSPITAL"
  },
  {
    type: "navitem",
    name: "Logs",
    key: "logs",
    icon: <Icon fontSize="small"><Dvr/></Icon>,
    route: "/logs",
    component: <UsageLogScreen />,
    role: "USER"
  },
  {
    type: "navitem",
    name: "Suppliers",
    key: "suppliers",
    icon: <Icon fontSize="small"><Store/></Icon>,
    route: "/suppliers",
    component: <ProviderScreen />,
    role: "HOSPITAL"
  },
  {
    type: "navitem",
    name: "Users",
    key: "user",
    icon: <Icon fontSize="small"><Person/></Icon>,
    route: "/user",
    component: <UserScreen />,
    role: "ADMINISTRATOR"
  },
  {
    type: "navitem",
    name: "Catalog",
    key: "catalog",
    icon: <Icon fontSize="small"><FormatListBulleted/></Icon>,
    route: "/catalog",
    component: <CatalogScreen />,
    role: "ADMINISTRATOR"
  },
  {
    type: "portal",
    name: "TechnicianScreen",
    key: "guest",
    route: "/guest",
    component: <TechnicianScreen/>,
    role: "GUEST"
  },
  {
    type: "summary",
    route: "/equipment/:equipmentId",
    component: <EquipmentSummary/>,
    role: "HOSPITAL,SUPPLIER"
  },
  {
    type: "summary",
    route: "/orders/:orderNum",
    component: <OrderSummary/>,
    role: "HOSPITAL,SUPPLIER"
  },
  {
    type: "summary",
    route: "/maintenance/:maintenanceId",
    component: <MaintenanceSummary/>,
    role: "HOSPITAL,SUPPLIER"
  },
  {
    type: "summary",
    route: "/suppliers/:providerId",
    component: <ProviderSummary/>,
    role: "HOSPITAL"
  },
  {
    type: "login",
    route: "/login",
    component: <LoginPage/>,
    role: "LOGIN"
  }
];

export default routes;
