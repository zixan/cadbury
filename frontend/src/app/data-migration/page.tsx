"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { NETSUITE_URL, QUICKBOOKS_URL, CADBURY_URL } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function Scripts() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");

  const [showDataTypes, setShowDataTypes] = useState(false);
  const [dataType, setDataType] = useState("");
  const [dataTypesVisible, setDataTypesVisible] = useState(false);

  const [showValidateReadyTabs, setShowValidateReadyTabs] = useState(false);
  const [showValidateReadyTabsVisible, setShowValidateReadyTabsVisible] =
    useState(false);
  const [showValidateReadyHeaderVisible, setShowValidateReadyHeaderVisible] =
    useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  
  useEffect(() => {
    if (source && destination) {
      setShowDataTypes(true);
      setTimeout(() => setDataTypesVisible(true), 50);
    } else {
      setDataTypesVisible(false);
      setShowDataTypes(false);
    }
  }, [source, destination]);

  useEffect(() => {
    if (dataType) {
      setLoading(true);
      setShowValidateReadyTabs(true);
      setTimeout(() => setShowValidateReadyHeaderVisible(true), 50);
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => setShowValidateReadyTabsVisible(true), 50);
        
        sendMessageToChromeExtension("setLoadingState", {state: true, status: "Navigating to Quickbooks"});
        setTimeout(() => {
          switchToQuickbooksTab()
          setTimeout(() => {
            // TODO - ZEESHAN - navigate to GL page and move cursor image here
            sendMessageToChromeExtension("setLoadingState", {state: true, status: "Exporting GL"});

            setTimeout(() => {
              switchToCadburyTab()
              router.push("/mapping");
            }, 3000);
          }, 1000);
        }, 3000);

      }, 3000);
    } else {
      setShowValidateReadyTabsVisible(false);
      setShowValidateReadyTabs(false);
    }
  }, [dataType]);
  
  const switchToQuickbooksTab = async () => {
    const tabs = await sendMessageToChromeExtension("getTabUrls", null);

    const quickbooksTabIndex = tabs.findIndex((url: string) =>
      url.includes(QUICKBOOKS_URL)
    );
    
    if (quickbooksTabIndex >= 0) {
      await sendMessageToChromeExtension("switchTabs", {
        tabIndex: quickbooksTabIndex,
      });
    }
  }

  const switchToCadburyTab = async () => {
    const tabs = await sendMessageToChromeExtension("getTabUrls", null);
    
    console.log(tabs);

    const cadburyTabIndex = tabs.findIndex((url: string) =>
      url.includes(CADBURY_URL)
    );
    
    console.log(cadburyTabIndex);
    
    if (cadburyTabIndex >= 0) {
      console.log("Switching to Cadbury tab");
      await sendMessageToChromeExtension("switchTabs", {
        tabIndex: cadburyTabIndex,
      });
    }
  }

  const sendMessageToChromeExtension = (action: string, payload: any) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        "pajhhcpmldjhoeibhffcilndgabaipip",
        { action, payload },
        (response: any) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Message sent successfully. Response:", response);

            if (response.action === "getTabUrls") {
              if (response.tabUrls && Array.isArray(response.tabUrls)) {
                resolve(response.tabUrls);
              }
            }
          }
        }
      );
    });
  };

  return (
    <>
      <div className="">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Data migration
        </h1>
        <div className="flex space-x-8 mt-4">
          <div>
            <h2 className="text font-semibold mb-2">Source</h2>
            <Select onValueChange={(value) => setSource(value)}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source1">QuickBooks</SelectItem>
                <SelectItem value="source3">Sage</SelectItem>
                <SelectItem value="source2">Xero</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="text font-semibold mb-2">Destination</h2>
            <Select onValueChange={(value) => setDestination(value)}>
              <SelectTrigger className="w-48 h-12">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dest3">Epicor</SelectItem>
                <SelectItem value="dest1">NetSuite</SelectItem>
                <SelectItem value="dest2">SAP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {showDataTypes && (
          <div
            className={`flex space-x-8 mt-8 transition-all duration-300 ease-in-out ${
              dataTypesVisible
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform -translate-y-4"
            }`}
          >
            <div>
              <h2 className="text font-semibold mb-2">Data types</h2>
              <Select onValueChange={(value) => setDataType(value)}>
                <SelectTrigger className="w-48 h-12">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dest2">Chart of accounts</SelectItem>
                  <SelectItem value="dest3">General Ledger</SelectItem>
                  <SelectItem value="dest1">Vendors</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
      {showValidateReadyTabs && (
        <div
          className={`flex space-x-8 mt-8 transition-all duration-300 ease-in-out ${
            showValidateReadyHeaderVisible
              ? "opacity-100 transform translate-y-0"
              : "opacity-0 transform -translate-y-4"
          }`}
        >
          <div>
            <h2 className="text font-semibold mb-2">Validating access</h2>
            {loading && (
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">Loading...</span>
              </div>
            )}
            {!loading && (
              <div className="mt-2 flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping mr-2" />
                <div>
                  <p className="text-sm font-medium leading-none">Quickbooks</p>
                </div>
                <span className="ml-4 h-2 w-2 rounded-full bg-green-500 animate-ping mr-2" />
                <div>
                  <p className="text-sm font-medium leading-none">NetSuite</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
