import React, { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "../components/ui/select";
import { Label } from "../components/ui/label";


type StatusType = "On Track";

type Branch = { branchId: number; branchName: string };
type District = { districtId: number; districtName: string };
type BranchResponse = {
  id: number;
  name: string;
};

type DistrictResponse = {
  id: number;
  name: string;
};

export default function UserPage() {
  // Form state
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [mobile, setMobile] = useState("");
  const [branchId, setBranchId] = useState<number | undefined>();
  const [districtId, setDistrictId] = useState<number | undefined>();
  const [issue, setIssue] = useState("");

  // Data state
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchSearch, setBranchSearch] = useState("");
  const [districts, setDistricts] = useState<District[]>([]);

  // UI state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [branchFetchError, setBranchFetchError] = useState<string | null>(null);
  const [districtFetchError, setDistrictFetchError] = useState<string | null>(null);

  // Refs for managing focus
  const branchSearchInputRef = useRef<HTMLInputElement>(null);
  const successPopupCloseBtnRef = useRef<HTMLButtonElement>(null);

  // For debounce on branch search input
 const debounceTimeoutRef = useRef<number | undefined>(undefined);


  // Load branches and districts with error handling and retry
  const fetchBranches = useCallback(() => {
    setBranchFetchError(null);
    fetch("http://10.1.85.10:8200/api/Complaint/branches")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load branches");
        return res.json();
      })
      .then((data: BranchResponse[]) => {
        const mapped = data.map((b) => ({
          branchId: b.id,
          branchName: b.name,
        }));
        setAllBranches(mapped);
        setBranches(mapped);
      })
      .catch((e) => {
        setAllBranches([]);
        setBranches([]);
        setBranchFetchError(e.message || "Failed to load branches");
      });
  }, []);

  const fetchDistricts = useCallback(() => {
    setDistrictFetchError(null);
    fetch("http://10.1.85.10:5000/api/Complaint/districts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load districts");
        return res.json();
      })
      .then((data: DistrictResponse[]) => {
        const mapped = data.map((d) => ({
          districtId: d.id,
          districtName: d.name,
        }));
        setDistricts(mapped);
      })
      .catch((e) => {
        setDistricts([]);
        setDistrictFetchError(e.message || "Failed to load districts");
      });
  }, []);

  useEffect(() => {
    fetchBranches();
    fetchDistricts();
  }, [fetchBranches, fetchDistricts]);

  // Issue options
  const issueOptions = [
    "Service excellency related",
    "Cash withdrawal at branches",
    "Cash deposits at branches",
    "Local fund transfers at branches",
    "Checks to be cashed",
    "Checks/CPOs paid through clearing",
    "Checks conversion through EATS(MT 103)",
    "Interbank EATS single customers transfer MT 103",
    "Interbank EATS credit transfer",
    "ATM cash withdrawals with local cards",
    "ATM fund transfer",
    "POS service/purchase/at merchant",
    "POS service/cash advance at branch/forex bureau - Local card",
    "Fund transfer through internet banking",
    "Fund transfer through mobile banking",
    "Fund transfer through mobile money/wallet",
    "Agent Service /Cash-in and Cash-out at agent/",
    "ATM cash withdrawals through international cards",
    "POS purchase through international card",
    "Cash advance through international cards at branch/Forex bureau",
    "Other",
  ];

  // Mobile number regex (Ethiopian numbers)
  const validateMobile = (num: string) => /^(\+251|0)?9\d{8}$/.test(num);

  // Inline validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) newErrors.firstName = "First Name is required.";
    if (!secondName.trim()) newErrors.secondName = "Second Name is required.";

    if (!mobile.trim()) newErrors.mobile = "Mobile Number is required.";
    else if (!validateMobile(mobile.trim()))
      newErrors.mobile = "Enter a valid Ethiopian mobile number.";

    if (!branchId) newErrors.branchId = "Please select a Branch.";
    if (!districtId) newErrors.districtId = "Please select a District.";
    if (!issue) newErrors.issue = "Please select an Issue.";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Debounced branch search to improve UX
  const handleBranchSearch = (value: string) => {
    setBranchSearch(value);
    window.clearTimeout(debounceTimeoutRef.current);
    debounceTimeoutRef.current = window.setTimeout(() => {
      if (!value.trim()) {
        setBranches(allBranches);
      } else {
        const filtered = allBranches.filter((b) =>
          b.branchName.toLowerCase().includes(value.toLowerCase())
        );
        setBranches(filtered);
      }
    }, 300);
  };

  // Manage focus on branch search input when dropdown opens
  // Assuming your Select component accepts onOpenChange or similar event (if not, you can add it)
  // For this demo, just auto focus on search input if it's visible
  useEffect(() => {
    if (branchSearchInputRef.current) {
      branchSearchInputRef.current.focus();
    }
  }, [branches]);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      setErrors({ ...errors, form: "User not authenticated. Please log in again." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const nowIso = new Date().toISOString();

    const branchName = branches.find((b) => b.branchId === branchId)?.branchName ?? "";
    const districtName = districts.find((d) => d.districtId === districtId)?.districtName ?? "";

    const complaint = {
      id: 0,
      lodgedDate: nowIso,
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      mobileNumber: mobile.trim(),
      branchName,
      districtName,
      branchId,
      districtId,
      issueRaised: issue,
      status: "On Track" as StatusType,
      statusUpdateDate: nowIso,
      userId: Number(userId),
      daysTaken: 0,
    };

    try {
      const res = await fetch("http://10.1.85.10:5000/api/Complaint/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(complaint),
      });

      if (!res.ok) throw new Error("Failed to submit complaint.");

      setShowSuccessPopup(true);

      setFirstName("");
      setSecondName("");
      setMobile("");
      setBranchId(undefined);
      setDistrictId(undefined);
      setIssue("");
      setBranchSearch("");
      setBranches(allBranches);

      // After popup shows, set focus to close button
      setTimeout(() => {
        if (successPopupCloseBtnRef.current) {
          successPopupCloseBtnRef.current.focus();
        }
      }, 100);

      setTimeout(() => setShowSuccessPopup(false), 5000);
    } catch (err) {
      setErrors({
        form: `❌ ${err instanceof Error ? err.message : String(err)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Submit Complaint</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-xl space-y-4"
        noValidate
        aria-describedby="form-error"
      >
        {/* Show form-level error if any */}
        {errors.form && (
          <div
            id="form-error"
            role="alert"
            className="mb-2 text-red-600 font-semibold bg-red-100 p-2 rounded"
          >
            {errors.form}
          </div>
        )}

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              aria-invalid={!!errors.firstName}
              aria-describedby={errors.firstName ? "error-firstName" : undefined}
            />
            {errors.firstName && (
              <p id="error-firstName" className="text-red-600 text-sm mt-1">
                {errors.firstName}
              </p>
            )}
          </div>
          <div className="w-1/2">
            <Label htmlFor="secondName">Second Name</Label>
            <Input
              id="secondName"
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
              required
              autoComplete="family-name"
              aria-invalid={!!errors.secondName}
              aria-describedby={errors.secondName ? "error-secondName" : undefined}
            />
            {errors.secondName && (
              <p id="error-secondName" className="text-red-600 text-sm mt-1">
                {errors.secondName}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="09xxxxxxxx"
              required
              autoComplete="tel"
              aria-invalid={!!errors.mobile}
              aria-describedby={errors.mobile ? "error-mobile" : undefined}
              maxLength={10}
              inputMode="tel"
            />
            {errors.mobile && (
              <p id="error-mobile" className="text-red-600 text-sm mt-1">
                {errors.mobile}
              </p>
            )}
          </div>

          <div className="w-1/2">
            <Label htmlFor="branchSelect">Branch</Label>
            {branchFetchError && (
              <div className="mb-1 text-red-600 text-sm flex items-center justify-between">
                <span>{branchFetchError}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={fetchBranches}
                  aria-label="Retry fetching branches"
                >
                  Retry
                </Button>
              </div>
            )}
            <Select
              value={branchId !== undefined ? branchId.toString() : ""}
              onValueChange={(val) => setBranchId(Number(val))}
              aria-describedby={errors.branchId ? "error-branchId" : undefined}
            >
              <SelectTrigger id="branchSelect" aria-label="Branch select">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1">
                  <Input
                    ref={branchSearchInputRef}
                    placeholder="Search branch..."
                    value={branchSearch}
                    onChange={(e) => handleBranchSearch(e.target.value)}
                    aria-label="Search branches"
                    autoComplete="off"
                  />
                </div>
                {branches.length > 0 ? (
                  branches.map((b) => (
                    <SelectItem key={b.branchId} value={b.branchId.toString()}>
                      {b.branchName}
                    </SelectItem>
                  ))
                ) : (
                  <p className="p-2 text-gray-500 select-none" aria-live="polite">
                    No branches found
                  </p>
                )}
              </SelectContent>
            </Select>
            {errors.branchId && (
              <p id="error-branchId" className="text-red-600 text-sm mt-1">
                {errors.branchId}
              </p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="districtSelect">District</Label>
          {districtFetchError && (
            <div className="mb-1 text-red-600 text-sm flex items-center justify-between">
              <span>{districtFetchError}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchDistricts}
                aria-label="Retry fetching districts"
              >
                Retry
              </Button>
            </div>
          )}
          <Select
            value={districtId?.toString()}
            onValueChange={(val) => setDistrictId(Number(val))}
            aria-describedby={errors.districtId ? "error-districtId" : undefined}
          >
            <SelectTrigger id="districtSelect" aria-label="District select">
              <SelectValue placeholder="Select District" />
            </SelectTrigger>
            <SelectContent>
              {districts.map((d) => (
                <SelectItem key={d.districtId} value={d.districtId.toString()}>
                  {d.districtName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.districtId && (
            <p id="error-districtId" className="text-red-600 text-sm mt-1">
              {errors.districtId}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="issueSelect">Issue Raised</Label>
          <Select
            value={issue}
            onValueChange={setIssue}
            aria-describedby={errors.issue ? "error-issue" : undefined}
          >
            <SelectTrigger id="issueSelect" aria-label="Issue select">
              <SelectValue placeholder="Select an Issue" />
            </SelectTrigger>
            <SelectContent>
              {issueOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.issue && (
            <p id="error-issue" className="text-red-600 text-sm mt-1">
              {errors.issue}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full text-black bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Complaint"}
        </Button>
      </form>

      {showSuccessPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-white/30 z-50"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="success-popup-title"
          aria-describedby="success-popup-desc"
          tabIndex={-1}
        >
          <div
            className="bg-white rounded-lg p-6 flex flex-col items-center space-y-4
                       animate-fadeInScale shadow-lg max-w-sm mx-4 relative"
          >
            <button
              onClick={() => setShowSuccessPopup(false)}
              aria-label="Close success message"
              ref={successPopupCloseBtnRef}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded"
            >
              ✕
            </button>
            <div className="text-5xl" aria-hidden="true">
              🎉
            </div>
            <h2
              id="success-popup-title"
              className="text-xl font-semibold text-center"
            >
              Complaint Submitted Successfully!
            </h2>
            <p
              id="success-popup-desc"
              className="text-center text-gray-700"
            >
              You can view the status on the other page.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
