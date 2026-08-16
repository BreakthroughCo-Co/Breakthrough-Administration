/**
 * Google Workspace & Google Maps API Service Integration
 * Connects NDIS Practice Management OS with Google Workspace:
 * - Google Drive & Google Picker (Document storage, BSP uploads)
 * - Google Sheets (NDIS PACE Claims export, batch billing)
 * - Google Docs (Behavior Support Plan generation, clinical reports)
 * - Google Slides (BSP Presentation decks, clinical case conferences)
 * - Google Calendar (Shift scheduling, home visits, telehealth)
 * - Gmail (Incident notifications, client emails, SLA alerts)
 * - Google Contacts (Participant, guardian & coordinator directory sync)
 * - Google Meet (Telehealth consultations & video conferences)
 * - Google Keep / Notes (Practitioner clinical scratchpad)
 * - Google Tasks (Compliance deadlines, worker screening renewals)
 * - Google Chat (Incident alerts & restrictive practice broadcasts)
 * - Google Forms (NDIS Intake questionnaires & risk screening)
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  iconLink?: string;
  modifiedTime?: string;
  size?: string;
}

export interface GoogleCalendarEvent {
  id?: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime: string; timeZone?: string };
  end: { dateTime: string; timeZone?: string };
  attendees?: { email: string; displayName?: string }[];
  conferenceData?: any;
  hangoutLink?: string;
}

export interface GoogleContact {
  resourceName?: string;
  names?: { displayName: string; familyName?: string; givenName?: string }[];
  emailAddresses?: { value: string; type?: string }[];
  phoneNumbers?: { value: string; type?: string }[];
  organizations?: { name: string; title?: string }[];
}

export interface GoogleTask {
  id?: string;
  title: string;
  notes?: string;
  due?: string;
  status?: 'needsAction' | 'completed';
}

export interface GoogleChatMessage {
  text: string;
}

// ---------------- Google Drive & Picker ----------------
export async function listDriveFiles(accessToken: string, query?: string): Promise<GoogleDriveFile[]> {
  try {
    const q = query ? encodeURIComponent(query) : encodeURIComponent("trashed = false and mimeType != 'application/vnd.google-apps.folder'");
    const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType,webViewLink,iconLink,modifiedTime,size)&pageSize=25`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Drive error: ${res.statusText}`);
    const data = await res.json();
    return data.files || [];
  } catch (error) {
    console.error('Failed to list Drive files:', error);
    throw error;
  }
}

export async function uploadFileToDrive(
  accessToken: string,
  fileName: string,
  content: string,
  mimeType: string = 'text/plain'
): Promise<{ id: string; webViewLink: string; name: string }> {
  try {
    const metadata = {
      name: fileName,
      mimeType: mimeType,
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', new Blob([content], { type: mimeType }));

    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: form,
    });
    if (!res.ok) throw new Error(`Upload error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to upload file to Drive:', error);
    throw error;
  }
}

// ---------------- Google Sheets ----------------
export async function createGoogleSheet(
  accessToken: string,
  title: string,
  headerRow: string[],
  dataRows: string[][]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
  try {
    // 1. Create Spreadsheet
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: { title },
        sheets: [{ properties: { title: 'NDIS Claims Export' } }],
      }),
    });
    if (!createRes.ok) throw new Error(`Sheet create failed: ${createRes.statusText}`);
    const sheet = await createRes.json();
    const spreadsheetId = sheet.spreadsheetId;
    const spreadsheetUrl = sheet.spreadsheetUrl;

    // 2. Populate Rows
    const values = [headerRow, ...dataRows];
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/NDIS%20Claims%20Export!A1:Z${values.length}?valueInputOption=USER_ENTERED`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    });

    return { spreadsheetId, spreadsheetUrl };
  } catch (error) {
    console.error('Failed to create Google Sheet:', error);
    throw error;
  }
}

// ---------------- Google Docs ----------------
export async function createGoogleDoc(
  accessToken: string,
  title: string,
  markdownOrText: string
): Promise<{ documentId: string; documentUrl: string }> {
  try {
    // 1. Create blank doc
    const res = await fetch('https://docs.googleapis.com/v1/documents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`Doc create error: ${res.statusText}`);
    const docData = await res.json();
    const documentId = docData.documentId;

    // 2. Insert text content
    await fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `${title}\n\n${markdownOrText}\n\n-- Generated by NDIS Practice Management OS --\n`,
            },
          },
        ],
      }),
    });

    return {
      documentId,
      documentUrl: `https://docs.google.com/document/d/${documentId}/edit`,
    };
  } catch (error) {
    console.error('Failed to create Google Doc:', error);
    throw error;
  }
}

// ---------------- Google Slides ----------------
export async function createGoogleSlideDeck(
  accessToken: string,
  title: string,
  slideTitles: string[]
): Promise<{ presentationId: string; presentationUrl: string }> {
  try {
    const res = await fetch('https://slides.googleapis.com/v1/presentations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error(`Slides create error: ${res.statusText}`);
    const data = await res.json();
    const presentationId = data.presentationId;

    // Add extra slides if requested
    if (slideTitles.length > 0) {
      const requests = slideTitles.map((t, idx) => ({
        createSlide: {
          insertionIndex: idx + 1,
          slideLayoutReference: { predefinedLayout: 'TITLE_AND_BODY' },
        },
      }));
      await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests }),
      });
    }

    return {
      presentationId,
      presentationUrl: `https://docs.google.com/presentation/d/${presentationId}/edit`,
    };
  } catch (error) {
    console.error('Failed to create Slides presentation:', error);
    throw error;
  }
}

// ---------------- Google Calendar ----------------
export async function listCalendarEvents(accessToken: string): Promise<GoogleCalendarEvent[]> {
  try {
    const timeMin = new Date().toISOString();
    const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=15&singleEvents=true&orderBy=startTime`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Calendar list failed: ${res.statusText}`);
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to list calendar events:', error);
    return [];
  }
}

export async function createCalendarEvent(
  accessToken: string,
  event: GoogleCalendarEvent,
  includeGoogleMeet: boolean = true
): Promise<GoogleCalendarEvent> {
  try {
    const body: any = { ...event };
    if (includeGoogleMeet) {
      body.conferenceData = {
        createRequest: {
          requestId: `meet-${Date.now()}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      };
    }
    const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error(`Calendar create error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to create calendar event:', error);
    throw error;
  }
}

// ---------------- Gmail ----------------
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  try {
    const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
    const messageParts = [
      `To: ${to}`,
      'Content-Type: text/html; charset=utf-8',
      'MIME-Version: 1.0',
      `Subject: ${utf8Subject}`,
      '',
      bodyText,
    ];
    const message = messageParts.join('\r\n');
    const encodedMessage = btoa(unescape(encodeURIComponent(message)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw: encodedMessage }),
    });
    if (!res.ok) throw new Error(`Gmail send error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to send Gmail message:', error);
    throw error;
  }
}

// ---------------- Google Meet ----------------
export async function generateGoogleMeetLink(
  accessToken: string,
  meetingTitle: string,
  startDateTime?: string,
  endDateTime?: string
): Promise<{ meetLink: string; eventId: string }> {
  const start = startDateTime || new Date(Date.now() + 1000 * 60 * 15).toISOString();
  const end = endDateTime || new Date(Date.now() + 1000 * 60 * 75).toISOString();

  const event = await createCalendarEvent(
    accessToken,
    {
      summary: `NDIS Telehealth: ${meetingTitle}`,
      description: `Telehealth clinical consultation & NDIS Behavior Support Plan review with participant & clinical team.\nCreated via NDIS Practice Management OS.`,
      start: { dateTime: start },
      end: { dateTime: end },
    },
    true
  );

  return {
    meetLink: event.hangoutLink || `https://meet.google.com/new`,
    eventId: event.id || '',
  };
}

// ---------------- Google Contacts ----------------
export async function listGoogleContacts(accessToken: string): Promise<GoogleContact[]> {
  try {
    const res = await fetch('https://people.googleapis.com/v1/people/me/connections?personFields=names,emailAddresses,phoneNumbers,organizations&pageSize=20', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Contacts list error: ${res.statusText}`);
    const data = await res.json();
    return data.connections || [];
  } catch (error) {
    console.error('Failed to list Google Contacts:', error);
    return [];
  }
}

export async function createGoogleContact(
  accessToken: string,
  givenName: string,
  familyName: string,
  email: string,
  phone: string,
  organization: string
): Promise<any> {
  try {
    const res = await fetch('https://people.googleapis.com/v1/people:createContact', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        names: [{ givenName, familyName }],
        emailAddresses: [{ value: email, type: 'work' }],
        phoneNumbers: [{ value: phone, type: 'mobile' }],
        organizations: [{ name: organization, title: 'NDIS Participant / Stakeholder' }],
      }),
    });
    if (!res.ok) throw new Error(`Contact create error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to create Google contact:', error);
    throw error;
  }
}

// ---------------- Google Tasks ----------------
export async function listGoogleTasks(accessToken: string): Promise<GoogleTask[]> {
  try {
    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks?showCompleted=true&maxResults=20', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) throw new Error(`Tasks list error: ${res.statusText}`);
    const data = await res.json();
    return data.items || [];
  } catch (error) {
    console.error('Failed to list Google Tasks:', error);
    return [];
  }
}

export async function createGoogleTask(
  accessToken: string,
  title: string,
  notes?: string,
  dueDateTime?: string
): Promise<GoogleTask> {
  try {
    const res = await fetch('https://tasks.googleapis.com/tasks/v1/lists/@default/tasks', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        notes,
        due: dueDateTime,
      }),
    });
    if (!res.ok) throw new Error(`Task create error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to create Google Task:', error);
    throw error;
  }
}

// ---------------- Google Chat (Webhook / Spaces) ----------------
export async function sendGoogleChatMessage(
  accessToken: string,
  spaceName: string,
  text: string
): Promise<any> {
  try {
    const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Chat error: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Failed to send Chat message:', error);
    throw error;
  }
}
