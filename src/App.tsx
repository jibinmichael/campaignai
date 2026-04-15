import { Route, Routes } from "react-router-dom"

import "./App.css"
import { AppShellLayout } from "@/layouts/app-shell-layout"
import { BuildSegmentPage } from "@/pages/build-segment-page"
import { ChooseCampaignTemplatePage } from "@/pages/choose-campaign-template-page"
import { CreateCampaignPage } from "@/pages/create-campaign-page"
import { AdsIntelligencePage } from "@/pages/ads-intelligence-page"
import { DashboardPage } from "@/pages/dashboard-page"

export default function App() {
  return (
    <Routes>
      <Route element={<AppShellLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/ads-intelligence" element={<AdsIntelligencePage />} />
        <Route path="/campaigns/new" element={<CreateCampaignPage />} />
        <Route path="/segments/new" element={<BuildSegmentPage />} />
        <Route
          path="/campaigns/new/template"
          element={<ChooseCampaignTemplatePage />}
        />
      </Route>
    </Routes>
  )
}
