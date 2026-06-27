rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 1. Global Safety Net
    match /{document=**} {
      allow read, write: if false;
    }

    // Helper functions
    function isValidId(id) {
      return id is string && id.size() <= 128 && id.matches('^[a-zA-Z0-9_\\-]+$');
    }

    function incoming() {
      return request.resource.data;
    }

    function existing() {
      return resource.data;
    }

    // Enquiry validations
    function isValidEnquiry(data) {
      return data.name is string && data.name.size() > 0 && data.name.size() <= 150
        && data.phone is string && data.phone.size() > 0 && data.phone.size() <= 30
        && (!data.keys().hasAll(['email']) || data.email == null || (data.email is string && data.email.size() <= 150))
        && (!data.keys().hasAll(['country']) || data.country == null || (data.country is string && data.country.size() <= 150))
        && data.program is string && data.program.size() > 0 && data.program.size() <= 150
        && (!data.keys().hasAll(['message']) || data.message == null || (data.message is string && data.message.size() <= 2000))
        && data.source is string && data.source.size() > 0 && data.source.size() <= 100
        && data.date is string && data.date.size() > 0
        && data.status is string && (data.status == 'New' || data.status == 'Contacted');
    }

    // Match enquiries
    match /enquiries/{enquiryId} {
      allow create: if isValidId(enquiryId) && isValidEnquiry(incoming());
      allow read, delete: if true;
      allow update: if isValidEnquiry(incoming());
    }

    // Match admin_config
    match /admin_config/{configId} {
      allow read, create, update, delete: if true;
    }
  }
}
