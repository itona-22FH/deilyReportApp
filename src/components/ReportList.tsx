/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import db from "../lib/firebase/firebase";
import { where, query, collection, getDocs, orderBy } from "firebase/firestore";
import { useAtom } from 'jotai';
import { activeTabAtom } from "../lib/atoms/atoms";

export function ReportList({onSelectedReport}: ReportListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("date");
  const [fetchedDailyReport, setFetchedDailyReport] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportsPerPage = 10;
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  //すべての日報を取得
  const fetchAllDailyReportByUserId = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "reports"),
        where("userId", "==", "hXRfwLUiITu3rKFtc8OV"),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
      } else {
        const reports = querySnapshot.docs.map((doc) => ({
          reportId: doc.id,
          content: doc.data().content,
          createdAt: doc.data().createdAt,
          status: doc.data().status,
          templateId: doc.data().templateId,
          updatedAt: doc.data().updatedAt,
          userId: doc.data().userId,
        }));
        setFetchedDailyReport(reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDailyReportByUserId();
  }, []);

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = fetchedDailyReport.slice(
    indexOfFirstReport,
    indexOfLastReport
  );

  const totalPages = Math.ceil(fetchedDailyReport.length / reportsPerPage);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 border-vivid-blue focus:border-vivid-purple focus:ring-vivid-purple"
          />
          <Button size="icon" variant="outline" className="text-vivid-blue">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value)}
          className="border-vivid-green focus:border-vivid-purple focus:ring-vivid-purple"
        >
          <option value="date">日付順</option>
          <option value="title">タイトル順</option>
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="animate-spin h-10 w-10 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-vivid-blue text-white">
              <TableHead>日付</TableHead>
              {/* <TableHead>タイトル</TableHead> */}
              <TableHead>内容</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentReports.map((report, index) => (
              <TableRow
                key={report.reportId}
                className={`cursor-pointer ${
                  index % 2 === 0 ? "bg-white" : "bg-vivid-blue bg-opacity-10"
                }`}
                onClick={() => {
                  onSelectedReport(report.reportId);
                  setActiveTab("create");
                }
                }
              >
                <TableCell>
                  {report.createdAt.toDate()
                    .toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                    .toString()}
                </TableCell>
                {/* <TableCell>{report.title}</TableCell> */}
                <TableCell>{report.content.slice(0, 30) + "..."}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="flex justify-between items-center">
        <div className="text-vivid-purple">
          {indexOfFirstReport + 1} -{" "}
          {Math.min(indexOfLastReport, fetchedDailyReport.length)} /{" "}
          {fetchedDailyReport.length} 件
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            size="icon"
            variant="outline"
            className="text-vivid-orange"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            size="icon"
            variant="outline"
            className="text-vivid-orange"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
