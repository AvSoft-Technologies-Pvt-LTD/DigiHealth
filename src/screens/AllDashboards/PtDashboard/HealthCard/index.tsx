import { SubscriptionPlan } from "../../../../constants/data";

interface UserData {
  firstName?: string;
  lastName?: string;
  name?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  email?: string;
  photo?: string;
  aadhaar?: string;
  state?: string;
  city?: string;
}

export const generateHealthId = (userData: UserData): string => {
  const now = new Date();
  const datePart =
    String(now.getFullYear()).slice(-2) +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");
  const stateCode = userData.state?.slice(0, 2).toUpperCase() || "XX";
  const districtCode = "01";
  const gender = userData.gender?.charAt(0).toUpperCase() || "X";
  const aadhaar = userData.aadhaar?.slice(-4) || String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  const serial = Math.floor(Math.random() * 9) + 1;
  return `${datePart}-${stateCode}${districtCode}${gender}-${aadhaar}${serial}`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
};

export const handlePlanSelect = (
  plan: SubscriptionPlan,
  setSelectedPlan: React.Dispatch<React.SetStateAction<SubscriptionPlan | null>>
) => {
  setSelectedPlan(plan);
};

export const handleActivatePlan = (
  selectedPlan: SubscriptionPlan | null,
  setIsCardActivated: React.Dispatch<React.SetStateAction<boolean>>,
  setShowPlansView: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (selectedPlan) {
    setIsCardActivated(true);
    setShowPlansView(false);
  }
};

export const handleChangePlan = (
  setShowPlansView: React.Dispatch<React.SetStateAction<boolean>>
) => {
  setShowPlansView(true);
};
