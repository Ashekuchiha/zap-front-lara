
import { lazy } from "react";
import { Navigate } from "react-router";

import Loadable from "src/layouts/full/shared/loadable/Loadable";
//form start
import AddServiceForm from "../views/MyWidgets/ashik/AddServiceForm";
import AddProviderForm from "src/views/MyWidgets/ashik/AddProviderForm";
import AddUserForm from "src/views/MyWidgets/ashik/AddUserForm";
import AddServicesLocationForm from "src/views/MyWidgets/ashik/AddServicesLocationForm";
import StateAll from "src/views/MyWidgets/ashik/StateAll"
import CityAll from "src/views/MyWidgets/ashik/CItyAll"

import  ServiceCategory from  "../views/MyWidgets/ashik/ServiceCategory"
//formm end
//page start
import Home from "src/views/MyWidgets/ashik/Home";
import ServicesAll from "src/views/MyWidgets/ashik/ServicesAll";
import CommissionSetup from "src/views/MyWidgets/ashik/CommissionSetup";
import ProviderAll from "src/views/MyWidgets/ashik/ProviderAll";
import UserAll from "src/views/MyWidgets/ashik/UserAlll";
import ServicesLocationAll from "src/views/MyWidgets/ashik/ServicesLocationAll";
import AddStateForm from "src/views/MyWidgets/ashik/AddStateForm";
import AddCityForm from "src/views/MyWidgets/ashik/AddCityForm";
//page end

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));



const Router = [
    {
      path: '/',
      element: <FullLayout />,
      children: [
        { path: '/', element: <Navigate to="/admin" /> },
        { path: '/admin', exact: true, element: <ModernDash /> },
        //form
        { path: '/admin/addserviceform', element: <AddServiceForm /> },
        { path: '/admin/addproviderform', element: <AddProviderForm /> },
        { path: '/admin/adduserform', element: <AddUserForm /> },
        { path: '/admin/adduserform', element: <AddUserForm /> },
        { path: '/admin/addserviceslocationform', element: <AddServicesLocationForm /> },
        { path: '/admin/addStateform', element: <AddStateForm /> },
        { path: '/admin/addCityform', element: <AddCityForm /> },

        //page
        { path: '/admin/home', element: <Home /> },
        { path: '/admin/services/all', element: <ServicesAll /> },
        { path: '/admin/commissionsetup', element: <CommissionSetup /> },
        { path: '/admin/providers/all', element: <ProviderAll /> },
        { path: '/admin/user/all', element: <UserAll /> },
        { path: '/admin/serviceslocation/all', element: <ServicesLocationAll /> },
        { path: '/admin/location/state/all', element: <StateAll /> },
        { path: '/admin/location/city/all', element: <CityAll /> },

        //edit
        {path:'admin/user/all/edit/:id' , element:<AddUserForm/>},
        {path:'admin/services/all/edit/:id' , element:<AddServiceForm/>},
        {path:'admin/serviceslocation/all/edit/:id' , element:<AddServicesLocationForm/>},
        {path:'admin/location/state/all/edit/:id' , element:<AddStateForm/>},
        {path:'admin/location/city/all/edit/:id' , element:<AddCityForm/>},
        {path:'admin/providers/all/edit/:id' , element:<AddProviderForm/>},
      ]
    }
  ]

export default Router;
