"use client";
import React, { useRef, useEffect } from "react";
import {
  SpreadsheetComponent,
  CellRenderEventArgs,
} from "@syncfusion/ej2-react-spreadsheet";
import { registerLicense } from "@syncfusion/ej2-base";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BugAntIcon, LightBulbIcon } from "@heroicons/react/24/solid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import LinesEllipsis from 'react-lines-ellipsis';
import { useRouter } from 'next/navigation';

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkxzWmFZfVpgcV9EaVZSQ2Y/P1ZhSXxXdkxjXH5Zcn1RQmBUUkA="
);

const mockData = [
  {
    "Full name": "13012308",
    "Account type": "Cash at bank and in hand",
    "Account sub type": "Current",
    "Description": ""
  },
  {
    "Full name": "Computer equipment DEPR",
    "Account type": "Tangible assets",
    "Account sub type": "Accumulated Depreciation",
    "Description": ""
  },
  {
    "Full name": "Sales of Product Income",
    "Account type": "Sales",
    "Account sub type": "Sales of Product Income",
    "Description": ""
  },
  {
    "Full name": "Supplies",
    "Account type": "Expenses",
    "Account sub type": "Supplies",
    "Description": ""
  },
  {
    "Full name": "Other debtors",
    "Account type": "Other Current Assets",
    "Account sub type": "Other current assets",
    "Description": ""
  },
  {
    "Full name": "Creditors",
    "Account type": "Creditors",
    "Account sub type": "Creditors",
    "Description": ""
  },
];

interface CellConfig {
  cell: string;
  backgroundColor: string;
}

function createCellArray(cellConfigs: CellConfig[]) {
  return cellConfigs.map((config) => {
    const [column, row] = config.cell.match(/([A-Z]+)(\d+)/).slice(1);
    console.log(column, row);
    const columnIndex =
      column
        .split("")
        .reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0) - 1;

    return {
      index: columnIndex,
      rowIndex: parseInt(row) - 1,
      style: { backgroundColor: config.backgroundColor },
    };
  });
}

const tasks = [
  {
    field: 'Full name',
    source: 'Quickbooks',
    contents: '13012308',
    reason: "This appears to be an account number rather than a name. Typically, account numbers should be accompanied by descriptive names, so it’s clear what the account is for. ",
    confidence: 'High',
    suggestion: '-',
    severity: 'Error',
  },
  {
    field: 'Full name',
    source: 'Quickbooks',
    contents: 'Computer equipment DEPR',
    reason: "The abbreviation \"DEPR\" stands for depreciation, but it might not be clear to all users. Abbreviations like this can create confusion, especially for people who are not familiar with your company's specific naming conventions or for external auditors who might review your financials.",
    confidence: 'High',
    suggestion: 'Computer equipment depreciation',
    severity: 'Error',
  },
  {
    field: 'Account type / Account sub type',
    source: 'Quickbooks',
    contents: 'Other debtors (Other Current Assets/Other current assets)',
    reason: "This is somewhat unusual. Typically, the Bad Debt Provision should be a contra asset account, reducing Debtors or Accounts Receivable. It could be better classified as a Liability or Contra Asset under the \"Allowance for Bad Debts\" subtype. While \"Other Current Assets\" works, the standard accounting treatment is to keep it linked to the Debtors account.",
    confidence: 'Medium',
    suggestion: 'Other debtors (Liability/Allowance for bad debts)',
    severity: 'Warning',
  },
  {
    field: 'Global',
    source: 'Quickbooks',
    contents: '-',
    reason: "Based on transaction history, your company purchases goods or services from out-of-state or foreign vendors who do not charge sales tax. We reccomending creating a Use Tax Payable account that is set up as a liability account.",
    confidence: 'Medium',
    suggestion: 'Create Use Tax Payable',
    severity: 'Warning',
  },
];

export default function App() {
  const router = useRouter();

  const cellConfigs: CellConfig[] = [
    { cell: "B4", backgroundColor: "#FF0000" },
    //{ cell: "A6", backgroundColor: "#00FF00" },
  ];

  //const cellArray = createCellArray(cellConfigs);
  const cellArray = [
    {
        "index": 0,
        "rowIndex": 3,
        "style": {
            "backgroundColor": "#FF0000"
        }
    }
]
  const spreadsheetRef = useRef(null);

  const onSpreadsheetCreated = () => {
    const spreadsheet = spreadsheetRef.current;
    if (spreadsheet) {
      const sheet = spreadsheet.getActiveSheet();
      const usedRange = sheet.usedRange;

      // Create a dynamic range based on the used cells in the spreadsheet
      const startCell = "A1";
      const endCell =
        String.fromCharCode(65 + usedRange.colIndex) + (usedRange.rowIndex + 1);
      const cellRange = `${startCell}:${endCell}`;

      spreadsheet.cellFormat(
        { fontSize: "16pt", fontFamily: "Inter" },
        cellRange
      );

      const headerRange = `A1:${String.fromCharCode(65 + usedRange.colIndex)}1`;
      spreadsheet.cellFormat({ fontWeight: 'bold' }, headerRange);
    }
  };

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

  useEffect(() => {
    sendMessageToChromeExtension("setLoadingState", {
      state: false,
      status: "",
    });
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Data validation
        </h1>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
          onClick={() => router.push('/mapping')}
        >
          Submit
        </button>
      </div>
      <div className="mt-4">
        <Tabs defaultValue="sourceData">
          <TabsList className="mb-4 space-x-4">
            <TabsTrigger value="sourceData">Source Data</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
          </TabsList>
          <TabsContent value="report">
            <div className="flex gap-x-8">
              <Card className="p-1 w-96 relative">
                <CardHeader>
                  <CardTitle className="tracking-tight text-sm font-medium">
                    Errors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">2</span>
                </CardContent>
                <BugAntIcon className="h-4 w-4 absolute top-4 right-4" />
              </Card>

              <Card className="p-1 w-96 relative">
                <CardHeader>
                  <CardTitle className="tracking-tight text-sm font-medium">
                    Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-2xl font-bold">2</span>
                </CardContent>
                <LightBulbIcon className="h-4 w-4 absolute top-4 right-4" />
              </Card>
            </div>
            
            <div className="mt-4">

      {/* Filters */}
      <div className="flex gap-2 items-center mb-4">
        <Input placeholder="Filter..." className="w-full" />
        <Button variant="outline">+ Severity</Button>
      </div>

      {/* Task Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">
              <Checkbox />
            </TableHead>
            <TableHead className="w-10">Source</TableHead>
            <TableHead className="w-48">Field</TableHead>
            <TableHead className="w-52">Current Value</TableHead>
            <TableHead className="w-[640px]">Reason</TableHead>
            <TableHead className="w-40">Suggested Value</TableHead>
            <TableHead className="">Confidence</TableHead>
            <TableHead className="">Severity</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={index}>
              <TableCell>
                <Checkbox />
              </TableCell>
              <TableCell>{task.source}</TableCell>
              <TableCell>{task.field}</TableCell>
              <TableCell>
                {task.contents}
              </TableCell>
              <TableCell>
                <LinesEllipsis
                  text={task.reason}
                  maxLine='2'
                  ellipsis='...'
                  trimRight
                  basedOn='letters'
                />
              </TableCell>
              <TableCell>
                {task.suggestion}
              </TableCell>
              <TableCell>
                {task.confidence}
              </TableCell>
              <TableCell>
                {task.severity}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

          </TabsContent>
          <TabsContent value="sourceData">
            <SpreadsheetComponent
              showRibbon={false}
              created={onSpreadsheetCreated}
              ref={spreadsheetRef}
              showFormulaBar={false}
              showSheetTabs={false}
              sheets={[
                {
                  name: "Sheet1",
                  ranges: [{ dataSource: mockData }],
                  rows: [
                    {
                      index: 1, 
                      cells: [
                        { 
                          index: 0,
                          style: { backgroundColor: "#FFD0D0" } 
                        }
                      ]
                    },
                    {
                      index: 2, 
                      cells: [
                        { 
                          index: 0,
                          style: { backgroundColor: "#FFD0D0" } 
                        }
                      ]
                    },
                    {
                      index: 5, 
                      cells: [
                        { 
                          index: 0,
                          style: { backgroundColor: "#FFFFD0" } 
                        }
                      ]
                    },
                    {
                      index: 6, 
                      cells: [
                        { 
                          index: 0,
                          style: { backgroundColor: "#FFFFD0" } 
                        }
                      ]
                    },
                  ],
                  columns: [
                    { width: 350 },
                    { width: 450 },
                    { width: 500 },
                    { width: 150 },
                  ],
                },
              ]}
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
