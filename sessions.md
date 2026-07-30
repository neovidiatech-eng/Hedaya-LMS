```# Hedaya Platform - Group Sessions API & Validation Reference

مرجع كامل للـ **Backend Endpoints**، شروط **Validations**، شروط الـ **Body & Params**، وأمثلة **JSON Responses** و **Errors Matrix** لتسهيل عمل فريق الفرونت إند بدون الحاجة للأكواد البرمجية.

---

## 1. General Request Information (معلومات عامة)

- **Base URL**: `/api/v1/schedules`
- **Authentication**: Bearer Token required for all routes.
  - Header: `Authorization: Bearer <JWT_TOKEN>`
- **Content-Type**: `application/json`
- **Timezone Header (Optional)**: `timezone: Africa/Cairo` (أو الإقليم المستهدف).

---

## 2. Notification Times Enum (`notification_Time`)

القيم المقبولة لـ `notification_Time` هي:
- `"5"` (قبل 5 دقائق)
- `"10"` (قبل 10 دقائق)
- `"30"` (قبل 30 دقيقة)
- `"60"` (قبل 60 دقيقة)

---

## 3. Endpoints Breakdown

---

### 3.1 إنشاء جلسة جماعية واحدة (Create Single Group Session)

- **Endpoint**: `POST /api/v1/schedules/create-one`
- **Permissions Required**: `sessions` (Write Permission)

#### Request Body Parameters (شروط الـ Validation):

| الحقل (Field) | النوع (Type) | الإجبارية (Required) | القيود الشروط (Constraints / Joi Validation) |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String (UUID)` | **مطلوب (Required)** | UUID صالح يمثل المعلم. |
| `subject_id` | `String (UUID)` | **مطلوب (Required)** | UUID صالح يمثل المادة. |
| `title` | `String` | **مطلوب (Required)** | اسم الجلسة (اسم غير فارغ). |
| `link` | `String (URL)` | **مطلوب (Required)** | رابط الإجتماع (Google Meet / Zoom URL صالح). |
| `start_time` | `String (ISO Date)`| **مطلوب (Required)** | تاريخ ووقت مستقبلي (أكبر من الوقت الحالي `greater("now")`). |
| `notification_Time`| `String` | **مطلوب (Required)** | إحدى القيم: `"5"`, `"10"`, `"30"`, `"60"`. |
| `studentIds` | `Array<UUID>` | اختياري* | قائمة بمُعرفات الطلاب المشاركين للجلسة الجماعية. |
| `studentId` | `String (UUID)` | اختياري* | مُعرف طالب واحد (*ملاحظة: يجب إرسال `studentIds` أو `studentId` على الأقل). |
| `isGroup` | `Boolean` | اختياري | `true` للجلسات الجماعية (يتم تفعيلها تلقائياً إذا كان عدد الطلاب > 1). |
| `maxStudents` | `Number` / `String` | اختياري | عدد الطلاب الأقصى للجلسة (مثال: `5` أو `"5"` أو `"unlimited"`). |
| `description` | `String` | اختياري | وصف الجلسة. |
| `notes` | `String` | اختياري | ملاحظات إضافية. |

#### Request Body Example (مثال الـ Request Body):
```json
{
  "title": "مراجعة تجويد - المجموعة الأولى",
  "description": "جلسة جماعية لمراجعة أحكام التجويد",
  "teacherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "subject_id": "8c59f214-4903-4b68-82a1-5f25d30e3bb4",
  "studentIds": [
    "c8a74e50-2d88-466d-9653-e5ef4691456a",
    "b2f15a89-9a74-4b57-a128-d7848e029f6b"
  ],
  "isGroup": true,
  "maxStudents": 5,
  "start_time": "2026-08-05T15:00:00.000Z",
  "link": "https://meet.google.com/abc-defg-hij",
  "notification_Time": "10",
  "notes": "إحضار المصحف الشريف"
}
```

#### Success Response Example (`201 Created` / `200 OK`):
```json
{
  "status": "success",
  "message": "SESSION_CREATED_SUCCESSFULLY",
  "data": {
    "id": "e403d980-87a1-4321-995a-641e779a1234",
    "title": "مراجعة تجويد - المجموعة الأولى",
    "description": "جلسة جماعية لمراجعة أحكام التجويد",
    "teacherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "studentId": null,
    "isGroup": true,
    "maxStudents": "5",
    "start_time": "2026-08-05T15:00:00.000Z",
    "end_time": "2026-08-05T16:00:00.000Z",
    "status": "scheduled",
    "subject": {
      "id": "8c59f214-4903-4b68-82a1-5f25d30e3bb4",
      "name_en": "Tajweed",
      "name_ar": "تجويد"
    },
    "groupStudents": [
      {
        "id": "g1-uuid",
        "studentId": "c8a74e50-2d88-466d-9653-e5ef4691456a",
        "student": {
          "id": "c8a74e50-2d88-466d-9653-e5ef4691456a",
          "user": { "name": "أحمد علي", "email": "ahmed@example.com" }
        }
      },
      {
        "id": "g2-uuid",
        "studentId": "b2f15a89-9a74-4b57-a128-d7848e029f6b",
        "student": {
          "id": "b2f15a89-9a74-4b57-a128-d7848e029f6b",
          "user": { "name": "سارة محمد", "email": "sara@example.com" }
        }
      }
    ]
  }
}
```

---

### 3.2 إنشاء جلسات جماعية دورية (Create Recurring Group Sessions)

- **Endpoint**: `POST /api/v1/schedules/create-recurring`
- **Permissions Required**: `sessions` (Write Permission)

#### Request Body Parameters (شروط الـ Validation):

| الحقل (Field) | النوع (Type) | الإجبارية (Required) | القيود الشروط (Constraints / Joi Validation) |
| :--- | :--- | :--- | :--- |
| `teacherId` | `String (UUID)` | **مطلوب** | UUID صالح للمدرس. |
| `subject_id` | `String (UUID)` | **مطلوب** | UUID صالح للمادة. |
| `title` | `String` | **مطلوب** | عنوان الجلسة الدورية. |
| `link` | `String (URL)` | **مطلوب** | رابط الاجتماع. |
| `startTime` | `String` | **مطلوب** | وقت بداية الجلسة بصيغة `HH:MM` (Regex: `/^([01]\d\|2[0-3]):?([0-5]\d)$/`). |
| `days` | `Array<String>` | **مطلوب** | أيام الأسبوع (أقلها يوم واحد): `"Saturday"`, `"Sunday"`, `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`. |
| `startDate` | `String (ISO Date)`| **مطلوب** | تاريخ البداية (تاريخ مستقبلي). |
| `endDate` | `String (ISO Date)`| اختياري | تاريخ النهاية (يجب أن يكون بعد تاريخ البداية). |
| `count` | `Number` | اختياري | عدد الجلسات الإجمالي المطلوبة. |
| `notification_Time`| `String` | **مطلوب** | `"5"`, `"10"`, `"30"`, `"60"`. |
| `studentIds` | `Array<UUID>` | اختياري | قائمة الطلاب في الجلسة الجماعية. |
| `isGroup` | `Boolean` | اختياري | `true`. |
| `maxStudents` | `Number` / `String` | اختياري | السعة القصوى للجلسة الجماعية. |

#### Request Body Example:
```json
{
  "title": "حلقة تحفيظ جماعية - دفعة أسبوعية",
  "teacherId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "subject_id": "8c59f214-4903-4b68-82a1-5f25d30e3bb4",
  "studentIds": [
    "c8a74e50-2d88-466d-9653-e5ef4691456a",
    "b2f15a89-9a74-4b57-a128-d7848e029f6b"
  ],
  "isGroup": true,
  "maxStudents": 10,
  "startTime": "17:00",
  "days": ["Saturday", "Tuesday"],
  "startDate": "2026-08-01",
  "endDate": "2026-08-31",
  "link": "https://meet.google.com/xyz-uvwx-rst",
  "notification_Time": "30"
}
```

---

### 3.3 تعديل جلسة جماعية (Update Group Session)

- **Endpoint**: `PATCH /api/v1/schedules/:id`
- **URL Params**: `id` (UUID للجلسة المراد تعديلها)
- **Permissions Required**: `sessions` (Write Permission)

#### Request Body Parameters:

| الحقل (Field) | النوع (Type) | الإجبارية (Required) | القيود الشروط (Constraints) |
| :--- | :--- | :--- | :--- |
| `title` | `String` | اختياري | عنوان جديد للجلسة. |
| `description` | `String` | اختياري | وصف جديد للجلسة. |
| `link` | `String (URL)` | اختياري | رابط جديد للجلسة. |
| `status` | `String` | اختياري | إحدى القيم: `"scheduled"`, `"planned"`, `"completed"`, `"missed"`, `"cancelled"`. |
| `start_time` | `String (ISO Date)`| اختياري | تاريخ ووقت جديد (تاريخ مستقبلي). |
| `notification_Time`| `String` | اختياري | `"5"`, `"10"`, `"30"`, `"60"`. |
| `studentIds` | `Array<UUID>` | اختياري | تعديل/تحديث قائمة الطلاب في الجلسة. |
| `maxStudents` | `Number` / `String` | اختياري | تعديل السعة القصوى. |

---

### 3.4 حذف جلسة فردية أو سلسلة جلسات دورية (Delete Endpoints)

- **حذف جلسة واحدة**: `DELETE /api/v1/schedules/:id`
  - URL Param: `id` (UUID للجلسة).
- **حذف سلسلة جلسات دورية بالكامل**: `DELETE /api/v1/schedules/group/:parent_recurring_id`
  - URL Param: `parent_recurring_id` (UUID الخاص بمجموعة الجلسات الدورية).

---

### 3.5 الدخول / الخروج من الجلسة (Join & Leave Session)

- **دخول الجلسة (Join)**: `POST /api/v1/schedules/:id/join`
  - URL Param: `id` (UUID).
- **مغادرة الجلسة (Leave)**: `POST /api/v1/schedules/:id/leave`
  - URL Param: `id` (UUID).

---

## 4. Backend Error Codes Matrix (أكواد الأخطاء واستجابتها)

عند حدوث خطأ، يُرجع الباك إند استجابة بالشكل التالي:
```json
{
  "status": "fail",
  "message": "ERROR_MESSAGE_KEY",
  "messageParams": { ... }
}
```

| HTTP Status | Error Message Key | السبب والحل (Reason & Meaning) |
| :--- | :--- | :--- |
| `400 Bad Request` | `STUDENT_ID_REQUIRED` | لم يتم إرسال أي معرف طالب في `studentId` أو `studentIds`. |
| `400 Bad Request` | `EXCEEDED_MAX_STUDENTS` | عدد الطلاب المحدد أكبر من السعة القصوى المسموحة للجلسة (`maxStudents`). |
| `400 Bad Request` | `INSUFFICIENT_SESSIONS` | رصيد الجلسات المتبقية لواحد أو أكثر من الطلاب غير كافٍ (`sessions_remaining < 1`). |
| `404 Not Found` | `STUDENT_NOT_FOUND` | واحد أو أكثر من معرفات الطلاب غير موجود في قاعدة البيانات. |
| `409 Conflict` | `STUDENT_CONFLICT` | تعارض في المواعيد: أحد الطلاب لديه جلسة أخرى في نفس هذا الوقت. |
| `409 Conflict` | `TEACHER_CONFLICT` | تعارض في المواعيد: المعلم لديه جلسة أخرى معجوزة في نفس الوقت. |
```


## 4. Subscription Plans Endpoints (`/api/v1/plans`)

---

### 4.1 Create Subscription Plan
- **HTTP Method**: `POST`
- **Path**: `/api/v1/plans`
- **Auth Required**: Yes (`Admin / Staff`)

#### Request Body Parameters

| Field Name | Type | Requirement | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name_en` | `String` | **Required** | Unique string | English plan name |
| `name_ar` | `String` | **Required** | Unique string | Arabic plan name |
| `price` | `Number \| String`| **Required** | Positive number | Price amount |
| `duration` | `Number` | **Required** | Integer (days) | Subscription validity duration |
| `sessionsCount` | `Number` | **Required** | Positive number | Total session quota included |
| `sessionTime` | `Number` | **Required** | Integer (minutes) | Duration per session in minutes |
| `currencyId` | `String` | **Required** | Valid UUID | Currency ID |
| `active` | `Boolean` | **Required** | `true` or `false` | Is plan active for subscription |
| `bestSeller` | `Boolean` | **Required** | `true` or `false` | Best seller badge flag |
| `isHidden` | `Boolean` | Optional | `true` or `false` | Hide from landing page |
| `isGroup` | `Boolean` | Optional | `true` or `false` | Group session plan flag |
| `maxStudents` | `Number` | Optional | Integer >= 1 | Max student capacity for group sessions |
| `planType` | `String` | Optional | `"individual" \| "group"` | Type of plan |
| `features` | `Array<String>` | Optional | Array of string features | List of feature bullet points |
| `description` | `String` | Optional | String | Plan description |

#### Request Body Example (JSON)
json
{
  "name_en": "Group Tajweed Plan",
  "name_ar": "باقة التجويد الجماعية",
  "price": "600",
  "duration": 30,
  "sessionsCount": 8,
  "sessionTime": 60,
  "currencyId": "c4b12345-6789-0123-4567-89abcdef0123",
  "active": true,
  "bestSeller": true,
  "isHidden": false,
  "isGroup": true,
  "maxStudents": 5,
  "planType": "group",
  "features": [
    "8 Group Sessions per month",
    "Max 5 students per group",
    "Recorded lessons included"
  ],
  "description": "Monthly group plan for Tajweed learning"
}


---

### 4.2 Update Subscription Plan
- **HTTP Method**: `PATCH`
- **Path**: `/api/v1/plans/:id`
- **Path Parameter**: `id` (UUID of the plan)

#### Request Body Example (JSON)
json
{
  "isGroup": true,
  "maxStudents": 10,
  "planType": "group",
  "price": "800"
}


---

### 4.3 Fetch Plans

#### Get All Plans (Admin / Dashboard)
- **HTTP Method**: `GET`
- **Path**: `/api/v1/plans`

#### Get Landing Page Plans (Public)
- **HTTP Method**: `GET`
- **Path**: `/api/v1/plans/landing`

---

## 5. Response Error Codes Matrix

| HTTP Status | Error Message Key | Cause / Description |
| :--- | :--- | :--- |
| `400 Bad Request` | `STUDENT_ID_REQUIRED` | Neither `studentId` nor `studentIds` was provided. |
| `400 Bad Request` | `EXCEEDED_MAX_STUDENTS` | Selected student count exceeds configured `maxStudents`. |
| `400 Bad Request` | `INSUFFICIENT_SESSIONS` | One or more students have `sessions_remaining < 1`. |
| `400 Bad Request` | `PLAN_ALREADY_EXISTS` | Plan name (`name_en` or `name_ar`) already exists. |
| `404 Not Found` | `STUDENT_NOT_FOUND` | Provided student ID does not exist. |
| `404 Not Found` | `TEACHER_NOT_FOUND` | Provided teacher ID does not exist. |
| `404 Not Found` | `SUBJECT_NOT_FOUND` | Provided subject ID does not exist. |
| `404 Not Found` | `PLAN_NOT_FOUND` | Provided plan ID does not exist. |
| `409 Conflict` | `STUDENT_CONFLICT` | Overlapping schedule exists for an enrolled student. |
| `409 Conflict` | `TEACHER_CONFLICT` | Overlapping schedule exists for the teacher. |