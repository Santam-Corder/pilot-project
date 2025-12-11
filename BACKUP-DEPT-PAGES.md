# Backup Information - Department Pages Implementation

**Backup Date:** December 11, 2025 at 8:38 PM IST

---

## Backup Locations

### 1. Git Branch Backup
**Branch Name:** `backup-dept-pages-working-2025-12-11`

**Location:** GitHub repository
- Repository: `Santam-Corder/pilot-project`
- Branch URL: [https://github.com/Santam-Corder/pilot-project/tree/backup-dept-pages-working-2025-12-11](https://github.com/Santam-Corder/pilot-project/tree/backup-dept-pages-working-2025-12-11)

**To restore from this backup:**
```bash
cd "d:\vs code repo\santam"
git checkout backup-dept-pages-working-2025-12-11
git push origin main --force
```

### 2. ZIP Archive Backup
**File:** `santam-backup-dept-pages-2025-12-11.zip`

**Location:** `d:\vs code repo\santam-backup-dept-pages-2025-12-11.zip`

**To restore from ZIP:**
1. Extract the ZIP file to desired location
2. Navigate to extracted folder
3. Push to GitHub:
```bash
cd "d:\vs code repo\santam"
git push origin main --force
```

---

## Current State (Backed Up)

**Commit:** `cd7f357` - "Fix Firestore document ID issue - use firestoreId for updates"

**Working Features:**
- ✅ Separate department pages (6 pages)
- ✅ Role-based login redirect
- ✅ Firebase real-time synchronization
- ✅ Task accept/decline/complete functionality
- ✅ Department-specific task filtering
- ✅ Connection status indicator
- ✅ Unique branding per department

**Live Site:** [https://santam-corder.github.io/pilot-project/](https://santam-corder.github.io/pilot-project/)

---

## Department Pages

| Department | File | Color | Icon | Status |
|------------|------|-------|------|--------|
| Cleaning | `cleaning.html` | Blue `#3498db` | 🧹 | ✅ Working |
| Maintenance | `maintenance.html` | Red `#e74c3c` | 🔧 | ✅ Working |
| Landscaping | `landscaping.html` | Green `#27ae60` | 🌳 | ✅ Working |
| Security | `security.html` | Dark `#2c3e50` | 🛡️ | ✅ Working |
| Laundry | `laundry.html` | Purple `#9b59b6` | 👕 | ✅ Working |
| Facilities | `facilities.html` | Orange `#f39c12` | 📋 | ✅ Working |

---

## Key Implementation Details

### Login Redirect Logic
- Admin users → `test8.html` (full dashboard)
- Department users → `{dept}.html` (e.g., `cleaning.html`)

### Task ID Handling
- **Custom ID**: Displayed to users (e.g., "TASK-CLN-002")
- **Firestore ID**: Used for database operations
- Stored separately as `firestoreId` to avoid conflicts

### Firebase Integration
- Collection: `tasks`
- Query filter: `where("dept", "==", DEPARTMENT)`
- Real-time updates via `onSnapshot`

---

## User Credentials

**Admin:**
- Email: `admin@berkeleyuae.com`
- Password: `Santam@123`

**Department Users:**
- Cleaning: `cln@berkeleyuae.com` / `cln@123`
- Maintenance: `mep@berkeleyuae.com` / `mep@123`
- Landscaping: `lsd@berkeleyuae.com` / `lsd@123`
- Security: `sec@berkeleyuae.com` / `sec@123`
- Laundry: `lau@berkeleyuae.com` / `lau@123`
- Facilities: `fm@berkeleyuae.com` / `fm@123`

---

## Restoration Instructions

### Option 1: Restore from Git Branch
```bash
cd "d:\vs code repo\santam"
git fetch origin
git checkout backup-dept-pages-working-2025-12-11
git push origin main --force
```

### Option 2: Restore from ZIP
1. Extract `d:\vs code repo\santam-backup-dept-pages-2025-12-11.zip`
2. Replace current `santam` folder with extracted contents
3. Push to GitHub:
```bash
cd "d:\vs code repo\santam"
git add .
git commit -m "Restore from backup"
git push origin main --force
```

---

## Notes

This backup captures the fully working state of the department pages implementation with:
- All 6 department pages functioning correctly
- Accept/Decline/Complete buttons working
- Proper Firestore document ID handling
- Real-time Firebase synchronization
- Role-based access control via separate pages
