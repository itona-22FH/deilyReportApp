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
  Search,
} from "lucide-react";
import { Notification } from "@/components/Notification";
import { PdfExportModal } from "@/components/PdfExportModal";
import { ReportList } from "@/components/ReportList";
import { CustomTemplateSelector } from "@/components/CustomTemplateSelector";
import { KeywordExtractor } from "@/components/KeywordExtractor";
import { ReportAnalysis } from "@/components/ReportAnalysis";
import { CommentSection } from "@/components/CommentSection";
import { RealtimeSync } from "@/components/RealtimeSync";
import db, { app } from "../lib/firebase/firebase";
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
import { CompletePopup } from "@/components/CompletePopup";
import { useAtom } from "jotai";
import { activeTabAtom } from "../lib/atoms/atoms";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export default function DailyReportApp() {
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);
  const [fetchedDailyReport, setFetchedDailyReport] = useState<DailyReport>({
    reportId: "",
    content: "",
    reportDate: "",
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const handleDailyReportChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setDailyReport(e.target.value);
  };

  //日報を取得
  const fetchDailyReport = async (id: string, date: Date | null) => {
    try {
      setFetchedDailyReport({
        reportId: "",
        content: "",
        reportDate: "",
        createdAt: "",
        status: "",
        templateId: "",
        updatedAt: "",
        userId: "",
      });
      setDailyReport("");
      setLoading(true);
      //すでに登録されている日報をIDで取得
      if (id) {
        const docRef = doc(db, "reports", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          setIsExistDailyReport(false);
          setDailyReport("");
        } else {
          const docData = docSnap.data();
          setFetchedDailyReport((prevState) => ({
            ...prevState,
            reportId: id,
            reportDate: docData.reportDate,
            content: docData.content,
            createdAt: docData.createdAt,
            status: docData.status,
            templateId: docData.templateId,
            updatedAt: docData.updatedAt,
            userId: docData.userId,
          }));
          setSelectedDate(docData.reportDate.toDate());
          setDailyReport(docData.content);
          setIsExistDailyReport(true);
        }
        //指定された日付の日報を取得
      } else if (date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const q = query(
          collection(db, "reports"),
          where("reportDate", ">=", startOfDay),
          where("reportDate", "<=", endOfDay)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setIsExistDailyReport(false);
          setDailyReport("");
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
        //当日の日報を取得
      } else {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        const q = query(
          collection(db, "reports"),
          where("reportDate", ">=", startOfDay),
          where("reportDate", "<=", endOfDay)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          setIsExistDailyReport(false);
          setDailyReport("");
        } else {
          querySnapshot.forEach((doc) => {
            setFetchedDailyReport((prevState) => ({
              ...prevState,
              reportId: doc.id,
              reportDate: doc.data().reportDate,
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
      const today = new Date();
      const copyToday = new Date(today);
      copyToday?.setHours(0, 0, 0, 0);
      const copySelectedDate = new Date(selectedDate ? selectedDate : "");
      copySelectedDate?.setHours(0, 0, 0, 0);
      const dateToUse = copySelectedDate !== copyToday ? selectedDate : today;
      const docRef = await addDoc(collection(db, "reports"), {
        content: dailyReport,
        createdAt: today,
        reportDate: dateToUse,
        status: "完了",
        templateId: "6dMQb1luWEFZDI87vBDt",
        updatedAt: today,
        userId: "hXRfwLUiITu3rKFtc8OV",
      });
      setIsRegistration(true);
      setIsRegistering(false);
      fetchDailyReport("", dateToUse);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
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
      setIsEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  // const templateTouroku = async () => {
  //   const docRef = doc(db, "templates", "jwyRuhOLT2lQc3Ak4frd");
  //   await updateDoc(docRef, {
  //     content: dailyReport,
  //   });
  // }

  const handleEditModeChange = () => {
    setIsEditMode(true);
  };

  useEffect(() => {
    fetchDailyReport("", null);

    // const messaging = getMessaging(app);

    // // トークンを取得
    // getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
    //   .then((currentToken) => {
    //     if (currentToken) {
    //       console.log("FCM Token:", currentToken);
    //     } else {
    //       console.log(
    //         "No registration token available. Request permission to generate one."
    //       );
    //     }
    //   })
    //   .catch((err) => {
    //     console.error("An error occurred while retrieving token. ", err);
    //   });

    // // フォアグラウンドでの通知受信
    // onMessage(messaging, (payload) => {
    //   console.log("Message received. ", payload);
    //   // 通知の処理を追加
    // });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-vivid-blue via-white to-vivid-purple text-gray-900">
      <header className="flex items-center justify-between border-b border-vivid-blue bg-white bg-opacity-80 p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-vivid-purple">日報管理</h1>
        <div className="flex items-center space-x-4">
          <PdfExportModal />
          <Notification fetchDailyReport={fetchDailyReport} />
        </div>
      </header>
      <main className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Button
              className="bg-orange-400 hover:bg-orange-300"
              onClick={() => {
                setActiveTab("create");
                setSelectedDate(new Date());
                fetchDailyReport("", null);
              }}
            >
              今日の日報
            </Button>
          </div>
          <div className="flex items-center">
            <Button
              variant={activeTab === "create" ? "default" : "outline"}
              onClick={() => setActiveTab("create")}
              className={`flex items-center ml-3 ${
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
              className={`flex items-center ml-3 ${
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
              className={`flex items-center ml-3 ${
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

        {activeTab === "create" ? (
          <div className="flex items-center space-x-2">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
              }}
              className="px-4 py-2 text-sm border rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              dateFormat="yyyy/MM/dd"
              placeholderText="日付を選択"
            />
            <Button
              size="icon"
              variant="outline"
              className="text-vivid-blue"
              onClick={() => {
                fetchDailyReport("", selectedDate);
              }}
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <></>
        )}

        {activeTab === "create" && (
          <div className="space-y-6">
            <div>
              {loading ? (
                <div className="flex justify-center" aria-label="読み込み中">
                  <div className="animate-spin h-10 w-10 border-4 border-black rounded-full border-t-transparent"></div>
                </div>
              ) : !loading && isExistDailyReport && !isEditMode ? (
                <pre className="text-md bg-gray-100 p-3 rounded">
                  {dailyReport}
                </pre>
              ) : (
                <>
                  <CustomTemplateSelector setDailyReport={setDailyReport} />
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
                </>
              )}
            </div>
            <KeywordExtractor />
            <div className="flex justify-end space-x-4">
              {isEditMode ? (
                <Button
                  className="text-white bg-red-500 hover:bg-red-600"
                  onClick={() => setIsEditMode(false)}
                >
                  キャンセル
                </Button>
              ) : (
                <></>
              )}
              {/* <Button variant="outline" className="text-black">
                下書き保存
              </Button> */}
              {!isEditMode ? (
                !loading && isExistDailyReport ? (
                  <Button
                    className="bg-purple-500 text-white hover:bg-purple-600 font-bold"
                    onClick={handleEditModeChange}
                  >
                    日報を編集する
                  </Button>
                ) : isRegistering ? (
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-400 font-bold"
                    disabled={isRegistering}
                  >
                    <Loader className="animate-spin mr-2 h-5 w-5" />
                    登録中・・・
                  </Button>
                ) : (
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-400 font-bold"
                    disabled={loading}
                    onClick={dailyWorkReportRegistration}
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    日報を登録する
                  </Button>
                )
              ) : isUpdating ? (
                <Button
                  className="bg-green-500 text-white hover:bg-green-600 font-bold"
                  disabled={isUpdating}
                >
                  <Loader className="animate-spin mr-2 h-5 w-5" />
                  保存中・・・
                </Button>
              ) : (
                <Button
                  className="bg-green-500 text-white hover:bg-green-600 font-bold"
                  onClick={updateDailyWorkReportRegistration}
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  日報を保存する
                </Button>
              )}
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <ReportList fetchDailyReport={fetchDailyReport} />
        )}

        {activeTab === "analysis" && <ReportAnalysis />}

        {activeTab === "create" && (
          <CommentSection
            reportId={fetchedDailyReport.reportId}
            isLoaded={loading}
          />
        )}
      </main>

      <CompletePopup
        isOpen={isUpdate}
        onClose={() => setIsUpdate(false)}
        action="保存"
        target="日報"
      />

      <CompletePopup
        isOpen={isRegistration}
        onClose={() => setIsRegistration(false)}
        action="登録"
        target="日報"
      />
      <RealtimeSync />

      {/* <Button onClick={templateTouroku}>テンプレート登録</Button> */}

      {/* <CustomTemplate /> */}
    </div>
  );
}
