import { Navigate } from "react-router-dom";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Category from "../pages/Category";
import Product from "../pages/Product";
import Role from "../pages/Role";
import User from "../pages/User";
import Bar from "../pages/Charts/Bar";
import Line from "../pages/Charts/Line";
import Pie from "../pages/Charts/Pie";
import ProductHome from "../pages/Product/ProductHome";
import ProductDetail from "../pages/Product/Detail";
import ProductAddUpdate from "../pages/Product/addUpdate";

const routes = [
  {
    path: "/admin",
    element: <Admin />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "products/category",
        element: <Category />,
      },
      {
        path: "products/product",
        element: <Product />,
        children: [
          { path: "home", element: <ProductHome /> },
          { path: "detail", element: <ProductDetail /> },
          { path: "addupdate", element: <ProductAddUpdate /> },
          { path: "", element: <Navigate to="home" /> },
        ],
      },
      {
        path: "role",
        element: <Role />,
      },
      { path: "user", element: <User /> },
      { path: "charts/bar", element: <Bar /> },
      { path: "charts/line", element: <Line /> },
      { path: "charts/pie", element: <Pie /> },
      { path: "", element: <Navigate to="home" /> },
    ],
  },
  { path: "/login", element: <Login /> },
  { path: "/", element: <Navigate to="/login" /> },
];

export default routes;
