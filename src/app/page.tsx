import fs from "fs/promises";
import { GoogleAuth } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";
import TheUiWrapper from "@/widgets/TheUiWrapper";

interface GoogleSheetRow {
  _deleted: boolean;
  _rowNumber: number;
  _rawData: string[];
  _worksheet: {
    _headerValues: string[];
    [key: string]: any;
  };
  [key: string]: any;
}

export interface RequestRow {
  ФИО: string;
  "Номер Обращения": string;
  Контакты: string;
  Вопрос: string;
  Статус: "NEW" | "sent";
  Категория: "Отработка" | "Другое";
  Дата: string;
}

export default async function Home() {
  const creds = JSON.parse(await fs.readFile("credentials.json", "utf8"));

  const sheetId = "1h9ygTRssHbdfgwpcuR1V7zHpWtGD2GdT46pDs_eRFSs";

  const auth = new GoogleAuth({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const doc = new GoogleSpreadsheet(sheetId, auth);

  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[1];
  const rows = await sheet.getRows<GoogleSheetRow>();

  const typedRows: RequestRow[] = rows.map((r) => ({
    ФИО: r.get("ФИО") ?? "",
    "Номер Обращения": r.get("Номер Обращения") ?? "",
    Контакты: r.get("Контакты") ?? "",
    Вопрос: r.get("Вопрос") ?? "",
    Статус: r.get("Статус") ?? "",
    Категория: r.get("Категория") ?? "",
    Дата: r.get("Дата") ?? "",
  }));

  return (
    <>
      {/* <UiWrapper typedRows={typedRows} /> */}
      <TheUiWrapper typedRows={typedRows} />
    </>
  );
}
