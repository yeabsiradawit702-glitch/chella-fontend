import { FaTelegram } from "react-icons/fa6";
import { LuLayoutDashboard,LuUsers,LuClipboardCheck,LuSquarePlus,LuLogOut, LuUser, LuArrowLeftRight } from "react-icons/lu";
export const SIDE_MENU_DATA =[
    {id:"01",
     lable:"Dashboard",
     icon:LuLayoutDashboard,
     path:"/admin/dashboard" 
    },
     {id:"02",
     lable:"Manage Tasks",
     icon:LuClipboardCheck,
     path:"/admin/tasks" ,
    },
     {id:"03",
     lable:"Create Task",
     icon:LuSquarePlus,
     path:"/admin/createtask" 
    },
     {id:"04",
     lable:"Team Members",
     icon:LuUsers,
     path:"/admin/users" 
    },
     {id:"05",
     lable:"Logout",
     icon:LuLogOut,
     path:"logout" 
    },
];
export const SIDE_MENU_USER_DATA=[
     {id:"01",
     lable:"Dashboard",
     icon:LuLayoutDashboard,
     path:"/user/dashboard" 
    },
     {id:"02",
     lable:"Tasks",
     icon:LuClipboardCheck,
     path:"/user/tasks" 
    },
     {id:"03",
     lable:"Refferals",
     icon:LuUsers,
     path:"/user/referrals" 
    },
        {id:"04",
     lable:"Transcation",
     icon:LuLayoutDashboard,
     path:"/user/transaction" 
    },
     {id:"05",
     lable:"Transfer",
     icon:FaTelegram,
     path:"/user/transfer" 
    },
    {id:"06",
     lable:"Profile",
     icon:LuUser,
     path:"/user/profile" 
    },
     {
  id: "07",
  lable: "Exchange Currency",
  icon: LuArrowLeftRight,
  path: "/user/exchange",
},
      {id:"07",
     lable:"Logout",
     icon:LuLogOut,
     path:"logout" 
    },
];
export const CATAGORY_DATA=[
    {lable:'Social',value:'Social'},
    {lable:'Video',value:'Video'},
    {lable:'Referral',value:'Referral'},
    {lable:'Profile',value:'Profile'},
]

export const STATUS_DATA=[
    {lable:'Pending',value:'pending'},
    {lable:'in progress',value:'in progress'},
    {lable:'completed',value:'completed'},

]