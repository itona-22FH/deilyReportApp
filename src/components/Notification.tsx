/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  where,
  query,
  collection,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import db from "../lib/firebase/firebase";
import { useAtom } from 'jotai';
import { activeTabAtom } from "../lib/atoms/atoms";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export function Notification({
  fetchDailyReport
}: NotificationProps) {
  const [isExistNotification, setIsExistNotification] = useState(false);
  const [fetchedNotifications, setFetchedNotifications] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useAtom(activeTabAtom);

  //すべての通知を取得
  const fetchAllNotifications = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", "hXRfwLUiITu3rKFtc8OV"),
        where("isRead", "==", false)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return setIsExistNotification(false);
      } else {
        const notificationsPromises = querySnapshot.docs.map(async (doc) => ({
          notificationId: doc.id,
          content: doc.data().content,
          createdAt: doc.data().createdAt,
          isRead: doc.data().isRead,
          reportId: doc.data().reportId,
          type: doc.data().type,
          userId: doc.data().userId,
          commentId: doc.data().commentId,
        }));
        const notifications = await Promise.all(notificationsPromises);
        setFetchedNotifications(notifications);
        const commentsPromises = notifications.map(async (notice) => {
          const docRef = doc(db, "comments", notice.commentId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            return {
              commentId: docSnap.id,
              content: docData.content,
              createdAt: docData.createdAt
                ?.toDate()
                .toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              reportId: docData.reportId,
              updatedAt: docData.updatedAt
                ?.toDate()
                .toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              userId: docData.userId,
              userName: docData.userName,
            };
          } else {
            console.log("No such document!");
          }
        });
        const comments = await Promise.all(commentsPromises);
        setComments(comments);
        setIsExistNotification(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNotifications();
  }, []);

  //未読の通知を選択する
  const handleNotificationClick = async (reportId: string, date: Date | null) => {
    try {
      //通知を既読に更新
      setIsUpdating(true);
      const q = query(
        collection(db, "notifications"),
        where("reportId", "==", reportId)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
      } else {
        const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
          const docRef = doc(db, "notifications", docSnapshot.id);
          return updateDoc(docRef, {
            isRead: true,
          });
        });
        await Promise.all(updatePromises);
        fetchAllNotifications();
      }
      //日報の取得
      setActiveTab("create");
      fetchDailyReport(reportId);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-[1.2rem] w-[1.2rem] text-gray-700" />
          <span className="sr-only">通知</span>
          {!isExistNotification ? (
            <></>
          ) : (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel>通知</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading || isUpdating ? (
          <div className="flex justify-center" aria-label="読み込み中">
            <div className="animate-spin h-10 w-10 border-4 mb-4 mt-4 border-black rounded-full border-t-transparent"></div>
          </div>
        ) : isExistNotification ? (
          comments.map((comment) => (
            <DropdownMenuItem
              key={comment.commentId}
              onClick={() => handleNotificationClick(comment.reportId)}
            >
              <div className="flex flex-col">
                <span className="font-medium">
                  <strong>
                    {comment.userName}さんがあなたの日報にコメントしました
                  </strong>
                </span>
                <span className="text-sm text-gray-500">
                  {comment.content.slice(0, 10) + "..."}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <DropdownMenuItem>
            <div className="flex flex-col">
              <span className="text-sm text-gray-500">
                新しい通知はありません。
              </span>
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
