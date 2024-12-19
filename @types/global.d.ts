/* eslint-disable @typescript-eslint/no-explicit-any */
type FetchDailyReportProps = {
  id: string;
};
type DailyReport = {
  reportId: string;
  content: string;
  createdAt: string;
  status: string;
  templateId: string;
  updatedAt: string;
  userId: string;
};

type ReportListProps = {
  onSelectedReport: (id: string) => Promise<void>;
  onChangeTab: any;
};

type CommentSectionProps = {
  reportId: string;
  isLoaded: boolean;
};

type UserComment = {
  commentId: string;
  content: string;
  createdAt: string;
  reportId: string;
  updatedAt: string;
  userId: string;
  userName: string;
};

type Template = {

  templateId: string
  content: string
  name: string,
}

type CustomTemplateSelectorProps = {
  onSelectedTemplate: (content: string) => void;
}

type NotificationProps = {
  onSelectedNotification: (id: string) => Promise<void>;
  onChangeTab: any;
}