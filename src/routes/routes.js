import { Routes, Route, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '../components/ProtectedRoute/ProtectedRoute.js';

import { CompanyLayout, DefaultLayout, WalletLayout } from '../layouts';

import CreateCampaign from '../CreateCampaign.js';
import HomePage from '../HomePage.js';

import EditCampaign from '../EditCampaign.js';

import NFTPage from '../pages/NFT/index.js';

import UpdateNft from '../UpdateNft.js';
import CreateNFT from '../pages/NFT/CreateNFT.js';

import CampaignPage from '../pages/Campaigns';
import WalletPage from '../pages/Wallet';
import CreateWallet from '../pages/CreateWalllet';

import WaitingList from '../pages/WaitingList';
import ConfirmEmail from '../pages/ConfirmEmail';

import { LoginPage, RegisterUser, RegisterWallet, RegisterWithCampaign } from '../pages/Auth';
import { AdminReportsPage, AdminCampaignsPage, AdminNFTPage, AdminLeadsPage } from '../pages/Admin';
import { AdminBrandsPage } from '../pages/Admin/Brands/Brands.js';
import { AdminKYBPage } from '../pages/Admin/KYB/KYB.js';
import UserProfile from "../pages/BrandProfile/userProfile";
import UserSecurity from "../pages/BrandProfile/userSecurity";
import CompanyProfile from "../pages/BrandProfile/companyProfile";
import BrandInvoices from "../pages/BrandProfile/brandInvoices";
import BrandWallet from "../pages/BrandWallet";

const routes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth/login" />} />

    <Route path="/auth" element={<DefaultLayout />}>
      <Route path="/auth/login" element={<LoginPage />} />

      <Route path="/auth/register/user" element={<RegisterUser />} />
      <Route path="/auth/register/wallet" element={<RegisterWallet />} />
      <Route path="/auth/register/campaign/:slug" element={<RegisterWithCampaign />} />

      <Route path="/auth/create-wallet" element={<CreateWallet />} />
      <Route path="/auth/confirm-email/:emailToken" element={<ConfirmEmail />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<CompanyLayout />}>
        <Route path="/dashboard" index element={<HomePage />} />
        <Route path="/dashboard/campaigns" element={<CampaignPage />} />
        <Route path="/dashboard/campaigns/edit/:id" element={<EditCampaign />} />
        <Route path="/dashboard/nfts" element={<NFTPage />} />
        <Route path="/dashboard/nfts/create" element={<CreateNFT />} />
        <Route path="/dashboard/nfts/update/:id" element={<UpdateNft />} />
        <Route path="/dashboard/campaigns/create" element={<CreateCampaign />} />
        <Route path="/dashboard/my-wallet" element={<BrandWallet />} />
        <Route path="/dashboard/user/profile" element={<UserProfile />} />
        <Route path="/dashboard/user/security" element={<UserSecurity />} />
        <Route path="/dashboard/company/profile" element={<CompanyProfile />} />
        <Route path="/dashboard/company/invoices" element={<BrandInvoices />} />
      </Route>
    </Route>

    <Route element={<ProtectedRoute admin />}>
      <Route path="/admin" element={<CompanyLayout />}>
        <Route path="/admin" index element={<HomePage />} />
        <Route path="/admin/brands" element={<AdminBrandsPage />} />
        <Route path="/admin/kyb" element={<AdminKYBPage />} />
        <Route path="/admin/leads" element={<AdminLeadsPage />} />
        <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
        <Route path="/admin/nfts" element={<AdminNFTPage />} />
        <Route path="/admin/reports" element={<AdminReportsPage />} />
      </Route>
    </Route>

    <Route path="/wallet/get-nft/:email/:id" element={<WaitingList />} />
    <Route element={<ProtectedRoute wallet />}>
      <Route path="/wallet" element={<WalletLayout />}>
        <Route path="/wallet" index element={<WalletPage />} />
      </Route>
    </Route>
  </Routes>
);

export default routes;
