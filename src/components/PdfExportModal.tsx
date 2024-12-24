/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Font,
} from "@react-pdf/renderer";
import nasuRegular from "./public/Nasu-Regular.ttf";
import nasuBold from "./public/fonts/Nasu-Bold";

Font.register({
  family: "Nasu-Regular",
  src: "./fonts/Nasu-Regular.ttf",
});

// フォント「ナス 太字」
Font.register({
  family: "Nasu-Bold",
  src: "./fonts/Nasu-Bold.ttf",
});

const styles = StyleSheet.create({
  tableCellHeader: {
    margin: 5,
    fontSize: 12,
    fontWeight: 500,
    fontFamily: "Nasu-Bold",
  },
  tableCell: {
    margin: 5,
    fontSize: 10,
    fontFamily: "Nasu-Regular",
  },
});

const MyDocument = ({ startDate, endDate }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>日報エクスポート</Text>
        <Text style={styles.text}>
          期間: {startDate} から {endDate}
        </Text>
        <Text style={styles.text}>ここに日報の内容が入ります。</Text>
      </View>
    </Page>
  </Document>
);

export function PdfExportModal() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-vivid-green">
          PDF出力
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-vivid-purple">日報のPDF出力</DialogTitle>
          <DialogDescription>
            出力したい日報の日付範囲を選択してください。
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="start-date" className="text-right text-vivid-blue">
              開始日
            </Label>
            <Input
              id="start-date"
              type="date"
              className="col-span-3 border-vivid-blue focus:border-vivid-purple focus:ring-vivid-purple"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="end-date" className="text-right text-vivid-blue">
              終了日
            </Label>
            <Input
              id="end-date"
              type="date"
              className="col-span-3 border-vivid-blue focus:border-vivid-purple focus:ring-vivid-purple"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <PDFDownloadLink
            document={<MyDocument startDate={startDate} endDate={endDate} />}
            fileName="daily_report.pdf"
          >
            {({ blob, url, loading, error }) => (
              <Button
                type="submit"
                className="bg-green-600 text-white hover:bg-green-700"
                disabled={loading || !startDate || !endDate}
              >
                {loading ? "Loading document..." : "PDF出力"}
              </Button>
            )}
          </PDFDownloadLink>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
