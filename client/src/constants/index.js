import { createCampaign, dashboard, logout, payment, profile, withdraw } from '../assets';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/ViewRequests',
    disabled: false,
  },
  // {
  //   name: 'withdraw',
  //   imgUrl: withdraw,
  //   link: '/WithdrawRequest',
  //   disabled: true,
  // },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    // link: '/',
    // disabled: true,
  },
];

let map = new Map();
for (let navlink of navlinks) {
  if (!navlink.disabled) map.set(navlink.link, navlink.name);
}

export const linkMap = map;
