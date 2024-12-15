

import { AccountBalance, BookmarkAdd, Camera, DeleteForever, GradingSharp, HourglassTop, LocalAtmSharp, LocationCity, MapOutlined, MapsHomeWorkOutlined, MiscellaneousServices, NotInterested, PaidSharp, Pending, PermIdentity, RotateLeftSharp, Soap, TableRows } from '@mui/icons-material';
import { uniqueId } from 'lodash';
import SaveAsIcon from '@mui/icons-material/SaveAs';

const Menuitems = [
    {
      navlabel: true,
      subheader: 'Home',
    },
  
    {
      id: uniqueId(),
      title: 'Dashboard',
      icon: Camera,
      href: '/admin',
      chipColor: 'secondary',
    },

    {
      navlabel: true,
      subheader: 'Main',
    },

    // {
    //   id: uniqueId(),
    //   title: 'Service',
    //   icon: MiscellaneousServices,
    //   href: '/admin/service',
    // },
    // {
    //   id: uniqueId(),
    //   title: 'Service Category',
    //   icon: MiscellaneousServices,
    //   href: '/admin/servicecategory',
    // },
    // {
    //   id: uniqueId(),
    //   title: 'Home',
    //   icon: MiscellaneousServices,
    //   href: '/admin/home',
    // },
    {
      id: uniqueId(),
      title: 'Services',
      icon: MiscellaneousServices,
      href: '/admin/services/',
      children :[
        {
          id: uniqueId(),
          title: 'All',
          icon: TableRows,
          href: '/admin/services/all',
        },
        {
          id: uniqueId(),
          title: 'Drafts',
          icon:SaveAsIcon,
          href: '/admin/services/drafts',
        },
      ]
    },
    // {
    //   id: uniqueId(),
    //   title: 'Commission Setup',
    //   icon: MiscellaneousServices,
    //   href: '/admin/commissionsetup',
    // },
    {
      id:uniqueId(),
      title:'Location',
      icon: MapOutlined,
      href: '/admin/location/',
      children :[
        {
          id: uniqueId(),
          title: 'State',
          icon: LocationCity,
          href: '/admin/location/state/all',
        },
        {
          id: uniqueId(),
          title: 'District',
          icon: LocationCity,
          href: '/admin/location/city/all',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'Services Organization',
      icon: MapsHomeWorkOutlined,
      href: '/admin/serviceslocation/',
      children :[
        {
          id: uniqueId(),
          title: 'All',
          icon: TableRows,
          href: '/admin/serviceslocation/all',
        },
        {
          id: uniqueId(),
          title: 'Drafts',
          icon:SaveAsIcon,
          href: '/admin/serviceslocation/drafts',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'Bookings',
      icon: BookmarkAdd,
      href: '/admin/booking/',
      children :[
        {
          id: uniqueId(),
          title: 'All',
          icon: TableRows,
          href: '/admin/booking/all',
        },
        {
          id: uniqueId(),
          title: 'Completed',
          icon: GradingSharp,
          href: '/admin/booking/completed',
        },
        {
          id: uniqueId(),
          title: 'On Going',
          icon: RotateLeftSharp,
          href: '/admin/booking/ongoing',
        },
        {
          id: uniqueId(),
          title: 'Waiting',
          icon: HourglassTop,
          href: '/admin/booking/waiting',
        },
        {
          id: uniqueId(),
          title: 'Canceled',
          icon: DeleteForever,
          href: '/admin/booking/canceled',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'Transactions',
      icon: AccountBalance,
      href: '/admin/Transactions/',
      children :[
        {
          id: uniqueId(),
          title: 'All Transactions',
          icon: TableRows,
          href: '/admin/Transactions/Alltransactions',
        },
        {
          id: uniqueId(),
          title: 'Due Transactions',
          icon: HourglassTop,
          href: '/admin/Transactions/Duetransactions',
        },
        {
          id: uniqueId(),
          title: 'Paid Transactions',
          icon: PaidSharp,
          href: '/admin/Transactions/Paidtransactions',
        },
        {
          id: uniqueId(),
          title: 'Commission Transactions',
          icon: LocalAtmSharp,
          href: '/admin/Transactions/Commissiontransactions',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'Providers/Vendors',
      icon: Soap,
      href: '/admin/providers/',
      children :[
        {
          id: uniqueId(),
          title: 'All',
          icon: TableRows,
          href: '/admin/providers/all',
        },
        {
          id: uniqueId(),
          title: 'Drafts',
          icon:SaveAsIcon,
          href: '/admin/Providers/drafts',
        },
        {
          id: uniqueId(),
          title: 'Holds',
          icon: Pending,
          href: '/admin/Providers/Holds',
        },
        {
          id: uniqueId(),
          title: 'Banned',
          icon: NotInterested,
          href: '/admin/Providers/Banned',
        },
      ]
    },
    {
      id: uniqueId(),
      title: 'Users',
      icon: PermIdentity,
      href: '/admin/user/',
      children :[
        {
          id: uniqueId(),
          title: 'All',
          icon: TableRows,
          href: '/admin/user/all',
        },
        {
          id: uniqueId(),
          title: 'Drafts',
          icon:SaveAsIcon,
          href: '/admin/user/drafts',
        },
        {
          id: uniqueId(),
          title: 'Holds',
          icon: Pending,
          href: '/admin/user/Holds',
        },
        {
          id: uniqueId(),
          title: 'Banned',
          icon: NotInterested,
          href: '/admin/user/Banned',
        },
      ]
    },
]

export default Menuitems;
