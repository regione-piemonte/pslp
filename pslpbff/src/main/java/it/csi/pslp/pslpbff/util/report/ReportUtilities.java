/**
 * ========================LICENSE_START=================================
 * Copyright (C) 2025 Regione Piemonte
 * SPDX-FileCopyrightText: Copyright 2025 | Regione Piemonte
 * SPDX-License-Identifier: EUPL-1.2
 * =========================LICENSE_END==================================
 */
package it.csi.pslp.pslpbff.util.report;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFCellStyle;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;

import io.quarkus.logging.Log;
import it.csi.pslp.pslpbff.api.dto.common.ReportResponse;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer;
import it.csi.pslp.pslpbff.util.mime.MimeTypeContainer.Extension;


@SuppressWarnings("deprecation")
public class ReportUtilities {

	public enum Format {

		PDF("pdf"), EXCELL("xls");

		private String format;

		Format(String format) {
			this.format = format;
		}

		public String getFormat() {
			return format;
		}
	}

	private ReportUtilities() {
	}

	
	public static String createReportTabellare(ReportTabellare report) {

		StringBuilder sb = new StringBuilder();
		sb.append(getStartDocument(report.isLandscape(), report.getName()));
		sb.append("<div class=\"titolo-mini\">" + report.getTitolo() + "</div>\r\n");
		sb.append("<br></br>\r\n");
		sb.append("<div>\r\n");
		sb.append("<table class=\"tabellaDati\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\">\r\n");
//		
//		// titoli tabella
		sb.append("<tr>\r\n");
		for (String nomeColonna : report.getNomiColonne()) {
			sb.append("<th class=\"tabellaTitolo\"><label>" + nomeColonna + "</label></th>\r\n");
		}
		sb.append("</tr>\r\n");

		// oggetti tabella
		for (List<Object> row : report.getValori()) {
			sb.append("<tr>\r\n");
			for (Object col : row) {
				sb.append("<td class=\"tabellaValore\"><label>" + formatText(col) + "</label></td>\r\n");
			}
			sb.append("</tr>\r\n");
		}

		sb.append("</table>\r\n");
		sb.append("</div>\r\n");

		sb.append(getEndDocument());
		return replaceSpecialChar(sb.toString());
	}

	public static String createReportTabellareVersamento(ReportTabellare report) {

		StringBuilder sb = new StringBuilder();

		// sb.append("<div class=\"titolo-mini\">" + report.getTitolo() + "</div>\r\n");
		sb.append("<br></br>\r\n");
		sb.append("<div>\r\n");
		sb.append("<table class=\"tabellaDati\" border=\"1\" cellpadding=\"0\" cellspacing=\"0\">\r\n");

		// titoli tabella
		sb.append("<tr>\r\n");
		for (String nomeColonna : report.getNomiColonne()) {
			sb.append("<th class=\"tabellaTitolo\"><label>" + nomeColonna + "</label></th>\r\n");
		}
		sb.append("</tr>\r\n");

		// oggetti tabella
		for (List<Object> row : report.getValori()) {
			sb.append("<tr>\r\n");
			for (Object col : row) {
				sb.append("<td class=\"tabellaValore\"><label>" + formatText(col) + "</label></td>\r\n");
			}
			sb.append("</tr>\r\n");
		}

		sb.append("</table>\r\n");
		sb.append("</div>\r\n");

		return replaceSpecialChar(sb.toString());
	}

	public static String getStartDocument(boolean landscape, String reportName) {
		String ret =

				// "<!DOCTYPE html PUBLIC \"-//OPENHTMLTOPDF//DOC XHTML Character Entities Only
				// 1.0//EN\" \"\">" +

				"<html>\r\n" + "<head>\r\n" + "    <style>\r\n";

		ret += "@page {";
		if (landscape)
			ret += "    size: A4 landscape;\r\n";
		ret += "    @bottom-left {content: 'Pag. ' counter(page) ' di ' counter(pages);	font-size: 10px; min-width: 100px; }\r\n";
		ret += "    @bottom-center {content: '" + reportName + "';	font-size: 10px; }\r\n";
		ret += "    @bottom-right {content: '" + getDateFooter() + "'; font-size: 10px;	min-width: 100px;}\r\n";
		ret += "}\r\n";

		ret += "        .titolo{\r\n" + "            font-size: 20pt;\r\n" + "            color: black;\r\n"
				+ "            font-family: Arial, Helvetica, sans-serif;\r\n" + "            text-align: center;\r\n"
				+ "        }\r\n" + "        .titolo-mini{\r\n" + "            font-size: 16pt;\r\n"
				+ "            color: black;\r\n" + "            font-family: Arial, Helvetica, sans-serif;\r\n"
				+ "            text-align: center;\r\n" + "        }\r\r" + "        .titoloSezione{\r\n"
				+ "        	 margin-left: 3px;\r\n" + "        	 margin-top: 20px;\r\n"
				+ "        	 margin-bottom: 10px;\r\n" + "            font-size: 16pt;\r\n"
				+ "            font-weight: bold;\r\n" + "            color: black;\r\n"
				+ "		     font-family: Arial, Helvetica, sans-serif;\r\n" + "        }\r\n" + "        .sezione{\r\n"
				+ "            color: black;\r\n" + "            border: 1px solid black;\r\n" + "        }\r\n"
				+ "        .subtitoloSezione{\r\n" + "        	 margin-left: 3px;\r\n"
				+ "        	 margin-top: 10px;\r\n" + "        	 margin-bottom: 6px;\r\n"
				+ "            font-size: 14pt;\r\n" + "            font-weight: bold;\r\n"
				+ "            font-style: italic;\r\n" + "            color: black;\r\n"
				+ "            font-family: Arial, Helvetica, sans-serif;\r\n" + "        }\r\n"
				+ "        .valore{\r\n" + "        	 margin-left: 3px;\r\n" + "			 margin-bottom: 5px;\r\n"
				+ "            font-size: 14pt\r\n" + "            color: black;\r\n"
				+ "            font-family: Arial, Helvetica, sans-serif;\r\n" + "            text-align: left;\r\n"
				+ "        }\r\n" + "        .valore-bold{\r\n" + "        	 margin-left: 3px;\r\n"
				+ "			 margin-bottom: 5px;\r\n" + "            font-size: 14pt\r\n"
				+ "            color: black;\r\n" + "            font-weight: bold;\r\n"
				+ "            font-family: Arial, Helvetica, sans-serif;\r\n" + "            text-align: left;\r\n"
				+ "        }\r\n" + "        .valore-space{\r\n" + "        	 margin-top: 20px;\r\n"
				+ "			 margin-bottom: 20px;\r\n" + "        }\r\n" + "		.fieldTabella{\r\n"
				+ "		     width: 50%;\r\n" + "         }\r\n" + "         .tabellaTitolo{\r\n"
				+ "            font-size: 14pt;\r\n" + "            color: black;\r\n"
				+ "            font-family: Arial, Helvetica, sans-serif;\r\n" + "            text-align: center;\r\n"
				+ "        }\r\n" + "        .tabellaValore{\r\n" + "            font-size: 12pt;\r\n"
				+ "            color: black;\r\n" + "            font-family: Arial, Helvetica, sans-serif;\r\n"
				+ "            text-align: center;\r\n" + "        }.tabellaDati{\r\n" + "            width: 100%;\r\n"
				+ "            border-collapse:collapse;\r\n" + "        }\r\n" + "    </style>\r\n" + "</head>\r\n"
				+ "<body>\r\n" + "	<br></br>\r\n";

		return ret;
	}

	public static String getEndDocument() {
		return "</body>\r\n" + "</html>\r\n";
	}

	public static String removeTime(Date date) {

		Calendar calendar = Calendar.getInstance();
		calendar.setTime(date);

		int anno = calendar.get(Calendar.YEAR);
		String mese = calendar.get(Calendar.MONTH) + 1 < 10 ? "0" + Integer.toString(calendar.get(Calendar.MONTH) + 1)
				: Integer.toString(calendar.get(Calendar.MONTH) + 1);
		String giorno = calendar.get(Calendar.DAY_OF_MONTH) < 10
				? "0" + Integer.toString(calendar.get(Calendar.DAY_OF_MONTH))
				: Integer.toString(calendar.get(Calendar.DAY_OF_MONTH));

		return giorno + "/" + mese + "/" + anno;
	}

	public static String fromMinutesToHHmm(int minutes) {
		long hours = TimeUnit.MINUTES.toHours(Long.valueOf(minutes));
		long remainMinutes = minutes - TimeUnit.HOURS.toMinutes(hours);
		return String.format("%02d:%02d", hours, remainMinutes);
	}

	public static String escapeHtml(String s) {
		String myString = StringEscapeUtils.escapeHtml4(s);
		return myString;
	}

	public static String replaceSpecialChar(String s) {

		Map<String, String> tokens = new HashMap<String, String>();

		tokens.put("&agrave;", "&#224;");
		tokens.put("&aacute;", "&#225;");
		tokens.put("&pound;", "&#163;");
		tokens.put("&sect;", "&#167;");
		tokens.put("&deg;", "&#176;");
		tokens.put("&ccedil;", "&#231;");
		tokens.put("&egrave;", "&#232;");
		tokens.put("&eacute;", "&#233;");
		tokens.put("&igrave;", "&#236;");
		tokens.put("&iacute;", "&#237;");
		tokens.put("&ograve;", "&#242;");
		tokens.put("&oacute;", "&#243;");
		tokens.put("&ugrave;", "&#249;");
		tokens.put("&uacute;", "&#250;");

		tokens.put("&nbsp;", "&#160;");
		tokens.put("&iexcl;", "&#161;");
		tokens.put("&cent;", "&#162;");
		tokens.put("&curren;", "&#164;");
		tokens.put("&yen;", "&#165;");
		tokens.put("&brvbar;", "&#166;");
		tokens.put("&uml;", "&#168;");
		tokens.put("&copy;", "&#169;");
		tokens.put("&ordf;", "&#170;");
		tokens.put("&laquo;", "&#171;");
		tokens.put("&not;", "&#172;");
		tokens.put("&shy;", "&#173;");
		tokens.put("&reg;", "&#174;");
		tokens.put("&macr;", "&#175;");
		tokens.put("&plusmn;", "&#177;");
		tokens.put("&sup2;", "&#178;");
		tokens.put("&sup3;", "&#179;");
		tokens.put("&acute;", "&#180;");
		tokens.put("&micro;", "&#181;");
		tokens.put("&para;", "&#182;");
		tokens.put("&middot;", "&#183;");
		tokens.put("&cedil;", "&#184;");
		tokens.put("&sup1;", "&#185;");
		tokens.put("&ordm;", "&#186;");
		tokens.put("&raquo;", "&#187;");
		tokens.put("&frac14;", "&#188;");
		tokens.put("&frac12;", "&#189;");
		tokens.put("&frac34;", "&#190;");
		tokens.put("&iquest;", "&#191;");
		tokens.put("&Agrave;", "&#192;");
		tokens.put("&Aacute;", "&#193;");
		tokens.put("&Acirc;", "&#194;");
		tokens.put("&Atilde;", "&#195;");
		tokens.put("&Auml;", "&#196;");
		tokens.put("&Aring;", "&#197;");
		tokens.put("&AElig;", "&#198;");
		tokens.put("&Ccedil;", "&#199;");
		tokens.put("&Egrave;", "&#200;");
		tokens.put("&Eacute;", "&#201;");
		tokens.put("&Ecirc;", "&#202;");
		tokens.put("&Euml;", "&#203;");
		tokens.put("&Igrave;", "&#204;");
		tokens.put("&Iacute;", "&#205;");
		tokens.put("&Icirc;", "&#206;");
		tokens.put("&Iuml;", "&#207;");
		tokens.put("&ETH;", "&#208;");
		tokens.put("&Ntilde;", "&#209;");
		tokens.put("&Ograve;", "&#210;");
		tokens.put("&Oacute;", "&#211;");
		tokens.put("&Ocirc;", "&#212;");
		tokens.put("&Otilde;", "&#213;");
		tokens.put("&Ouml;", "&#214;");
		tokens.put("&times;", "&#215;");
		tokens.put("&Oslash;", "&#216;");
		tokens.put("&Ugrave;", "&#217;");
		tokens.put("&Uacute;", "&#218;");
		tokens.put("&Ucirc;", "&#219;");
		tokens.put("&Uuml;", "&#220;");
		tokens.put("&Yacute;", "&#221;");
		tokens.put("&THORN;", "&#222;");
		tokens.put("&szlig;", "&#223;");
		tokens.put("&acirc;", "&#226;");
		tokens.put("&atilde;", "&#227;");
		tokens.put("&auml;", "&#228;");
		tokens.put("&aring;", "&#229;");
		tokens.put("&aelig;", "&#230;");
		tokens.put("&ecirc;", "&#234;");
		tokens.put("&euml;", "&#235;");
		tokens.put("&icirc;", "&#238;");
		tokens.put("&iuml;", "&#239;");
		tokens.put("&eth;", "&#240;");
		tokens.put("&ntilde;", "&#241;");
		tokens.put("&ocirc;", "&#244;");
		tokens.put("&otilde;", "&#245;");
		tokens.put("&ouml;", "&#246;");
		tokens.put("&divide;", "&#247;");
		tokens.put("&oslash;", "&#248;");
		tokens.put("&ucirc;", "&#251;");
		tokens.put("&uuml;", "&#252;");
		tokens.put("&yacute;", "&#253;");
		tokens.put("&thorn;", "&#254;");
		tokens.put("&yuml;", "&#255;");
		tokens.put("&OElig;", "&#338;");
		tokens.put("&oelig;", "&#339;");
		tokens.put("&Scaron;", "&#352;");
		tokens.put("&scaron;", "&#353;");
		tokens.put("&Yuml;", "&#376;");
		tokens.put("&circ;", "&#710;");
		tokens.put("&tilde;", "&#732;");
		tokens.put("&ensp;", "&#8194;");
		tokens.put("&emsp;", "&#8195;");
		tokens.put("&thinsp;", "&#8201;");
		tokens.put("&zwnj;", "&#8204;");
		tokens.put("&zwj;", "&#8205;");
		tokens.put("&lrm;", "&#8206;");
		tokens.put("&rlm;", "&#8207;");
		tokens.put("&ndash;", "&#8211;");
		tokens.put("&mdash;", "&#8212;");
		tokens.put("&lsquo;", "&#8216;");
		tokens.put("&rsquo;", "&#8217;");
		tokens.put("&sbquo;", "&#8218;");
		tokens.put("&ldquo;", "&#8220;");
		tokens.put("&rdquo;", "&#8221;");
		tokens.put("&bdquo;", "&#8222;");
		tokens.put("&dagger;", "&#8224;");
		tokens.put("&Dagger;", "&#8225;");
		tokens.put("&permil;", "&#8240;");
		tokens.put("&lsaquo;", "&#8249;");
		tokens.put("&rsaquo;", "&#8250;");
		tokens.put("&euro;", "&#8364;");

		tokens.put("&", "&#38;");

		// Create pattern of the format "%(cat|beverage)%"
		String patternString = "(" + StringUtils.join(tokens.keySet(), "|") + ")";
		Pattern pattern = Pattern.compile(patternString);
		Matcher matcher = pattern.matcher(s);

		StringBuffer sb = new StringBuffer();
		while (matcher.find()) {
			matcher.appendReplacement(sb, tokens.get(matcher.group(1)));
		}
		matcher.appendTail(sb);

		// System.out.println(sb.toString());

		return sb.toString();

	}

	public static void makePdfFile(String basePath, String htmlContent, String fileName, Long annoRiferimento) throws Exception {
		ByteArrayOutputStream baosPdf = new ByteArrayOutputStream();
		PdfRendererBuilder builder = new PdfRendererBuilder();
		builder.withHtmlContent(htmlContent, null);
		builder.toStream(baosPdf);
		builder.run();
		builder = null;
		baosPdf.close();

		File dir = new File(new File(basePath), Long.toString(annoRiferimento));
		dir.mkdirs();
		File targetFile = new File(dir, fileName + ".pdf");

		try (FileOutputStream outputStream = new FileOutputStream(targetFile)) {
			outputStream.write(baosPdf.toByteArray());
		}
	}

	public static void makePdfFileResponse(ReportResponse response, File file, String templateFileName)
			throws Exception {
		byte[] bytes = Files.readAllBytes(file.toPath());
		response.setBytes(bytes);
		if (templateFileName != null)
			response.setFileNameTemplate(templateFileName);
		response.setMimeTypeContainer(MimeTypeContainer.byExtension(MimeTypeContainer.Extension.PDF));
	}

	public static void makePdfResponse(ReportResponse response, String htmlContent, String templateFileName)
			throws Exception {

		ByteArrayOutputStream baosPdf = new ByteArrayOutputStream();

		PdfRendererBuilder builder = new PdfRendererBuilder();

		builder.withHtmlContent(htmlContent, null);
		builder.toStream(baosPdf);
		builder.run();
		builder = null;

		baosPdf.close();

		byte[] bytes = baosPdf.toByteArray();

		response.setBytes(bytes);
		response.setFileNameTemplate(templateFileName);
		response.setMimeTypeContainer(MimeTypeContainer.byExtension(MimeTypeContainer.Extension.PDF));

	}

	public static void makePdfResponse(ReportResponse response, ReportTabellare reportTabellare,
			String templateFileName) throws Exception {
		String htmlContent = ReportUtilities.createReportTabellare(reportTabellare);
		makePdfResponse(response, htmlContent, templateFileName);
	}

	public static String formatText(Object obj) {
		if (obj != null) {
			String text = obj.toString();
			if (text != null && text.trim().length() > 0)
				return text;
		}
		return "";
	}

	private static final SimpleDateFormat sdateFormat = new SimpleDateFormat("dd/MM/yyyy");
	private static final SimpleDateFormat sdateFormatTime = new SimpleDateFormat("dd/MM/yyyy HH:mm:ss");

	public static String formatDate(Date date) {
		if (date != null) {
			try {
				return sdateFormat.format(date);
			} catch (Exception err) {
			}
		}
		return "";
	}

	public static String formatDateTime(Date date) {
		if (date != null) {
			try {
				return sdateFormatTime.format(date);
			} catch (Exception err) {
			}
		}
		return "";
	}

	public static String getDateFooter() {
		try {
			Locale.setDefault(Locale.ITALIAN);
			return new SimpleDateFormat("dd MMMM yyyy").format(new Date());
		} catch (Exception err) {
		}

		return "";
	}

	public static String formatImporto(BigDecimal num) {
		if (num != null)
			return num.toPlainString();
		return "";
	}

	public static String formatNumber(BigDecimal num) {
		if (num != null)
			return num.toPlainString();
		return "";
	}

	public static String formatNumber(Long num) {
		if (num != null)
			return "" + num;
		return "";
	}
	
	public static String formatNumber(BigDecimal num, DecimalFormat formatDecimal) {
		if (num != null)
			return formatDecimal.format(num);
		return "";
	}
	

	

	public static void makeReportResponse(String format, ReportResponse response, ReportTabellare reportTabellare)
			throws Exception {
		if (ReportUtilities.Format.EXCELL.getFormat().equalsIgnoreCase(format))
			makeXlsResponse(response, reportTabellare, response.getFileNameTemplate());
		else
			makePdfResponse(response, reportTabellare, response.getFileNameTemplate());
	}

	public static void makeXlsResponse(ReportResponse response, ReportTabellare reportTabellare,
			String templateFileName) throws Exception {

		ByteArrayOutputStream bos = null;
		XSSFWorkbook workbookOutput = null;
		try {
			workbookOutput = new XSSFWorkbook();
			XSSFSheet sheet = workbookOutput.createSheet(reportTabellare.getTitolo());

			int rowCount = 0;
			Row row = null;
			Cell cell = null;

			// TITOLI
			row = sheet.createRow(rowCount);
			
			XSSFFont titleFont = workbookOutput.createFont();
			titleFont.setBold(true);
			XSSFCellStyle titleStyle = workbookOutput.createCellStyle();
			titleStyle.setFillForegroundColor(IndexedColors.GREY_80_PERCENT.getIndex());
			titleStyle.setFont(titleFont);

			int column = 0;
			for (String colonna : reportTabellare.getNomiColonne()) {
				cell = row.createCell(column++);
				cell.setCellStyle(titleStyle);
				cell.setCellValue(colonna);
			}

			if (reportTabellare.getValori() != null) {
				for (List<Object> valori : reportTabellare.getValori()) {
	
					row = sheet.createRow(++rowCount);
					
				
	
					column = 0;
					for (Object valore : valori) {
						if (valore instanceof String) 
							cell = row.createCell(column++, CellType.STRING);
						else if (valore instanceof BigDecimal || valore instanceof Double || valore instanceof Long) 
							cell = row.createCell(column++, CellType.NUMERIC);
						else cell = row.createCell(column++);
						cell.setCellValue(formatText(valore));
					}
				}
			}

			for (int i = 0; i < reportTabellare.getNomiColonne().size(); i++)
				sheet.autoSizeColumn(i);

			bos = new ByteArrayOutputStream();
			workbookOutput.write(bos);
			response.setBytes(bos.toByteArray());
			response.setFileNameTemplate(templateFileName);
			response.setMimeTypeContainer(MimeTypeContainer.byExtension(Extension.EXCEL_SPREADSHEET));

		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e);
		} finally {
			if (workbookOutput != null)
				try {
					workbookOutput.close();
				} catch (IOException e1) {
				}
			if (bos != null)
				try {
					bos.close();
				} catch (IOException e) {
				}
			Log.debug("XSL - fine");
		}

	}

}
