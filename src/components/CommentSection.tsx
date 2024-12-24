/* eslint-disable react-hooks/exhaustive-deps */
import { SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Edit,
  Loader,
  MessageSquareIcon,
  PlusIcon,
  RefreshCw,
  X,
} from "lucide-react";
import db from "@/lib/firebase/firebase";
import {
  query,
  collection,
  where,
  getDocs,
  orderBy,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { CompletePopup } from "./CompletePopup";

export function CommentSection({ reportId, isLoaded }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<UserComment[]>([]);
  const [isRegistration, setIsRegistration] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isEditTarget, setIsEditTarget] = useState("");
  const [updatedComment, setUpdatedComment] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  //すべてのコメントを取得
  const fetchAllComment = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, "comments"),
        where("reportId", "==", reportId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map((doc) => {
        return {
          commentId: doc.id,
          content: doc.data().content,
          createdAt: doc
            .data()
            .createdAt?.toDate()
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          reportId: doc.data().reportId,
          updatedAt: doc
            .data()
            .updatedAt?.toDate()
            .toLocaleDateString("ja-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          userId: doc.data().userId,
          userName: doc.data().userName,
        };
      });
      setComments(comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // データ取得完了時にロード状態を解除
    }
  };

  //新しいコメントの追加
  const handleCommentSubmit = async () => {
    try {
      if (!reportId || !newComment) {
        alert("ない");
        return;
      }
      setIsRegistering(true);
      const commentDoc = await addDoc(collection(db, "comments"), {
        content: newComment,
        createdAt: new Date(),
        reportId: reportId,
        updatedAt: new Date(),
        userId: "hXRfwLUiITu3rKFtc8OV",
        userName: "たけのこ大先生",
      });
      setIsRegistration(true);
      setNewComment("");
      fetchAllComment();

      await addDoc(collection(db, "notifications"), {
        commentId: commentDoc.id,
        content: "コメントが追加されました",
        createdAt: new Date(),
        isRead: false,
        reportId: reportId,
        type: "コメント",
        userId: "hXRfwLUiITu3rKFtc8OV",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCommentChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setUpdatedComment(e.target.value.toString());
  };

  const handleTargetComment = (id: string, content: string) => {
    setIsEditTarget(id);
    setUpdatedComment(content);
  };

  //コメントの更新
  const handleUpdateComment = async () => {
    setIsUpdating(true);
    const docRef = doc(db, "comments", isEditTarget);
    try {
      await updateDoc(docRef, {
        content: updatedComment,
        updatedAt: new Date(),
      });
      setIsEditTarget("");
      setUpdatedComment("");
      setIsUpdate(true);
      fetchAllComment();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchAllComment();
  }, [isLoaded]);

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <MessageSquareIcon className="mr-2" />
        コメント
      </h2>
      {loading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="animate-spin mb-4 h-10 w-10 border-4 border-black rounded-full border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
              className="bg-gray-100 p-4 rounded-lg pointer"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <span className="text-gray-500">{comment.userName}</span>
                  {isEditTarget === comment.commentId ? (
                    <X onClick={() => setIsEditTarget("")}></X>
                  ) : (
                    <Edit
                      className="ml-1 w-5 h-5"
                      onClick={() =>
                        handleTargetComment(comment.commentId, comment.content)
                      }
                    />
                  )}
                </div>
                <span className="text-sm text-gray-500 ">
                  {comment.createdAt}
                </span>
              </div>
              {isEditTarget === comment.commentId ? (
                <div className="flex items-center">
                  <Textarea
                    readOnly={isEditTarget === comment.commentId ? false : true}
                    value={
                      updatedComment !== null ? updatedComment : comment.content
                    }
                    className={`text-xl ${
                      isEditTarget === comment.commentId
                        ? "border-black"
                        : "border-none"
                    }
                  overflow-hidden`}
                    onChange={handleCommentChange}
                  >
                    {comment.content}
                  </Textarea>
                  <Button
                    className="ml-3 bg-purple-500 p-1 hover:bg-purple-600"
                    onClick={handleUpdateComment}
                  >
                    {isUpdating ? (
                      <>
                        <Loader className="animate-spin h-5 w-5" />
                        保存中・・・
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-5 w-5" />
                        保存
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <pre className="text-md">{comment.content}</pre>
              )}
            </div>
          ))}
        </div>
      )}

      <Textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="コメントを入力..."
        className="mb-4"
      />
      <Button onClick={handleCommentSubmit}>
        {isRegistering ? (
          <>
            <Loader className="animate-spin mr-2 h-5 w-5" />
            登録中・・・
          </>
        ) : (
          <>
            <PlusIcon className="mr-2 h-5 w-5" />
            コメントを登録
          </>
        )}
      </Button>
      <CompletePopup
        isOpen={isUpdate}
        onClose={() => setIsUpdate(false)}
        action="更新"
        target="コメント"
      />
      <CompletePopup
        isOpen={isRegistration}
        onClose={() => setIsRegistration(false)}
        action="登録"
        target="コメント"
      />
    </div>
  );
}
