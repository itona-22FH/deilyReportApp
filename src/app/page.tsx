/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React from "react";
import { useState, useEffect, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  PlusIcon,
  ListIcon,
  BarChartIcon,
  RefreshCw,
  Loader,
} from "lucide-react";
import { Notification } from "@/components/Notification";
import { PdfExportModal } from "@/components/PdfExportModal";
import { ReportList } from "@/components/ReportList";
import { CustomTemplateSelector } from "@/components/CustomTemplateSelector";
import { KeywordExtractor } from "@/components/KeywordExtractor";
import { ReportAnalysis } from "@/components/ReportAnalysis";
import { CommentSection } from "@/components/CommentSection";
import { RealtimeSync } from "@/components/RealtimeSync";
import db from "../lib/firebase/firebase";
import {
  where,
  query,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { UpdateCompletePopup } from "@/components/UpdateCompletePopup";
import { useAtom } from 'jotai';
import { activeTabAtom } from "../lib/atoms/atoms";

export default function DailyReportApp() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [fetchedDailyReport, setFetchedDailyReport] = useState<DailyReport>({
    reportId: "",
    content: "",
    createdAt: "",
    status: "",
    templateId: "",
    updatedAt: "",
    userId: "",
  });
  const [isExistDailyReport, setIsExistDailyReport] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dailyReport, setDailyReport] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isRegistration, setIsRegistration] = useState(false);
  const [error, setError] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleDailyReportChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setDailyReport(e.target.value);
  };

  //すでに登録されてる日報を取得
  const fetchDailyReport = async (id: string) => {
    try {
      setFetchedDailyReport({
        reportId: "",
        content: "",
        createdAt: "",
        status: "",
        templateId: "",
        updatedAt: "",
        userId: "",
      });
      setDailyReport("");
      setLoading(true);
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      if (id) {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setIsExistDailyReport(false);
        } else {
          const docData = docSnap.data();
          setFetchedDailyReport((prevState) => ({
            ...prevState,
            reportId: id,
            content: docData.content,
            createdAt: docData.createdAt,
            status: docData.status,
            templateId: docData.templateId,
            updatedAt: docData.updatedAt,
            userId: docData.userId,
          }));
          setDailyReport(docData.content);
          setIsExistDailyReport(true);
        }
      } else {
        const q = query(
          collection(db, "reports"),
          where("createdAt", ">=", startOfDay),
          where("createdAt", "<=", endOfDay)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setIsExistDailyReport(false);
        } else {
          querySnapshot.forEach((doc) => {
            setFetchedDailyReport((prevState) => ({
              ...prevState,
              reportId: doc.id,
              content: doc.data().content,
              createdAt: doc.data().createdAt,
              status: doc.data().status,
              templateId: doc.data().templateId,
              updatedAt: doc.data().updatedAt,
              userId: doc.data().userId,
            }));
            setDailyReport(doc.data().content);
          });
          setIsExistDailyReport(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // データ取得完了時にロード状態を解除
    }
  };

  //新しい日報を追加
  const dailyWorkReportRegistration = async () => {
    try {
      setIsRegistering(true);
      const docRef = await addDoc(collection(db, "reports"), {
        content: dailyReport,
        createdAt: new Date(),
        status: "完了",
        templateId: "6dMQb1luWEFZDI87vBDt",
        updatedAt: new Date(),
        userId: "hXRfwLUiITu3rKFtc8OV",
      });
      setIsRegistration(true);
      setIsRegistering(false);
      fetchDailyReport("");
    } catch (err) {
      console.error(err);
    }
  };

  //日報データを更新
  const updateDailyWorkReportRegistration = async () => {
    try {
      setIsUpdating(true);
      const docRef = doc(db, "reports", fetchedDailyReport.reportId);
      await updateDoc(docRef, {
        content: dailyReport,
        updatedAt: new Date(),
      });
      setIsUpdate(true);
      setIsUpdating(false);
    } catch (err) {
      setError(true);
    }
  };

  // const templateTouroku = async () => {
  //   const docRef = doc(db, "templates", "jwyRuhOLT2lQc3Ak4frd");
  //   await updateDoc(docRef, {
  //     content: dailyReport,
  //   });
  // }


  useEffect(() => {
    fetchDailyReport("");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vivid-blue via-white to-vivid-purple text-gray-900">
      <header className="flex items-center justify-between border-b border-vivid-blue bg-white bg-opacity-80 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-vivid-purple">日報管理</h1>
        <div className="flex items-center space-x-4">
          <PdfExportModal />
          <Notification
            onSelectedNotification={fetchDailyReport}
          />
        </div>
      </header>
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              className="bg-orange-400 hover:bg-orange-300"
              onClick={() => fetchDailyReport("")}
            >
              今日の日報
            </Button>
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className={`flex items-center  ${
                activeTab === "create"
                  ? "bg-black text-white font-bold"
                  : "text-black text-black"
              }`}
            >
              <PlusIcon className="mr-2 h-5 w-5" />
              日報作成
            </Button>
            <Button
              variant={activeTab === "list" ? "default" : "outline"}
              onClick={() => setActiveTab("list")}
              className={`flex items-center ${
                activeTab === "list"
                  ? "bg-black text-white font-bold"
                  : "text-black text-black"
              }`}
            >
              <ListIcon className="mr-2 h-5 w-5" />
              日報一覧
            </Button>
            <Button
              variant={activeTab === "analysis" ? "default" : "outline"}
              onClick={() => setActiveTab("analysis")}
              className={`flex items-center ${
                activeTab === "analysis"
                  ? "bg-black text-white font-bold"
                  : "text-black text-black"
              }`}
            >
              <BarChartIcon className="mr-2 h-5 w-5" />
              分析
            </Button>
          </div>
        </div>

        {activeTab === "create" && (
          <div className="space-y-6">
            <CustomTemplateSelector onSelectedTemplate={setDailyReport} />
            <div>
              {loading ? (
                <div className="flex justify-center" aria-label="読み込み中">
                  <div className="animate-spin h-10 w-10 border-4 border-black rounded-full border-t-transparent"></div>
                </div>
              ) : (
                <Textarea
                  placeholder={
                    loading
                      ? "日報データを取得中"
                      : "今日の作業内容を入力してください..."
                  }
                  className="min-h-[200px] border-vivid-blue focus:border-vivid-purple focus:ring-vivid-purple"
                  onChange={handleDailyReportChange}
                  value={dailyReport}
                />
              )}
            </div>
            <KeywordExtractor />
            <div className="flex justify-end space-x-4">
              <Button variant="outline" className="text-black">
                下書き保存
              </Button>
              {!loading && isExistDailyReport ? (
                <Button
                  className="bg-purple-500 text-white hover:bg-purple-600 font-bold"
                  onClick={updateDailyWorkReportRegistration}
                >
                  {isUpdating ? (
                    <>
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      更新中・・・
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5" />
                      日報を更新する
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-400 font-bold"
                  disabled={loading}
                  onClick={dailyWorkReportRegistration}
                >
                  {isRegistering ? (
                    <>
                      <Loader className="animate-spin mr-2 h-5 w-5" />
                      登録中・・・
                    </>
                  ) : (
                    <>
                      <PlusIcon className="mr-2 h-5 w-5" />
                      日報を追加する
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <ReportList
            onSelectedReport={fetchDailyReport}
          />
        )}

        {activeTab === "analysis" && <ReportAnalysis />}

        {activeTab === "create" && (
          <CommentSection
            reportId={fetchedDailyReport.reportId}
            isLoaded={loading}
          />
        )}
      </main>

      <UpdateCompletePopup
        isOpen={isUpdate}
        onClose={() => setIsUpdate(false)}
        action="更新"
        target="日報"
      />

      <UpdateCompletePopup
        isOpen={isRegistration}
        onClose={() => setIsRegistration(false)}
        action="追加"
        target="日報"
      />
      <RealtimeSync />

      {/* <Button onClick={templateTouroku}>テンプレート登録</Button> */}

      {/* <CustomTemplate /> */}
    </div>
  );
}
