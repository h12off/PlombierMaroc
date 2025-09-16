
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Language } from '../types';

const translations = {
  en: {
    "header": { "title": "Plombier Maroc", "register": "Join Directory", "findPlumber": "Find a Plumber" },
    "home": { "title": "Your Trusted <1>Plumber<1> is a Click Away.", "subtitle": "Join Morocco's premier directory for professional plumbers. Register in minutes and connect with hundreds of customers in your city today.", "imageAlt": "Plumbing tools" },
    "form": { 
      "namePlaceholder": "Full Name", 
      "phonePlaceholder": "600123456", 
      "bioPlaceholder": "Your professional bio (Optional)", 
      "addressPlaceholder": "Street Address (Optional)",
      "selectCityPlaceholder": "Select a City", 
      "submitButton": "Join The Directory Now", 
      "successMessage": "Success! Your profile has been added to the directory.", 
      "submitError": "There was an error submitting your profile. Please try again.", 
      "photoCta": "Upload photo (Optional)", 
      "getLocationButton": "Get Location (Optional)", 
      "locationFetching": "Getting your location...", 
      "locationSuccess": "Location captured!", 
      "locationError": "Could not get location. Please allow permission.",
      "imagePreviewAlt": "Profile preview",
      "removeImageLabel": "Remove image",
      "submitting": "Submitting...",
      "validation": {
        "nameRequired": "Name is required.",
        "phoneRequired": "Phone number is required.",
        "phoneInvalid": "Please enter a valid 9-digit number (starting with 6 or 7).",
        "cityRequired": "City is required.",
        "imageType": "Invalid file type. Please upload a JPG, PNG, or GIF.",
        "imageSize": "File is too large. Maximum size is 5MB."
      }
    },
    "directory": { 
      "title": "Plumber Directory", 
      "subtitle": "Find and contact professional plumbers near you.", 
      "filterLabel": "Filter by City:", 
      "allCities": "All", 
      "noPlumbersTitle": "No Plumbers Found", 
      "noPlumbersMessage": "There are no plumbers listed for \"{city}\". Try selecting another city or check back later.",
      "searchPlaceholder": "Search by name, city, or address...",
      "noSearchResults": "No plumbers found matching \"{query}\".",
      "bestRated": "Best Rated",
      "mostLiked": "Most Liked",
      "plumbersFound_one": "Showing 1 plumber.",
      "plumbersFound_other": "Showing {count} plumbers."
    },
    "card": { 
        "callNow": "Call Now ({phone})", 
        "call": "Call Now", 
        "ratingAverage_one": "from {count} rating",
        "ratingAverage_other": "from {count} ratings", 
        "noRatings": "No ratings yet", 
        "ratingThankYou": "Thank you for your feedback!", 
        "verified": "Verified",
        "new": "New",
        "comments_one": "{count} comment",
        "comments_other": "{count} comments"
    },
    "plumberDetail": {
        "backToDirectory": "Back to Directory",
        "commentsTitle": "Comments & Reviews",
        "noComments": "No comments yet. Be the first to leave one!",
        "commentFormTitle": "Leave a Comment",
        "commentSuccess": "Comment posted successfully!",
        "commentError": "Failed to post comment. Please try again.",
        "noBio": "No bio provided."
    },
    "commentForm": {
        "namePlaceholder": "Your Name",
        "commentPlaceholder": "Write your comment here...",
        "submitButton": "Post Comment",
        "submitting": "Posting...",
        "validation": {
            "nameRequired": "Name is required.",
            "commentRequired": "Comment cannot be empty."
        }
    },
    "timeAgo": {
      "justNow": "Just now",
      "second_one": "{count} second ago",
      "second_other": "{count} seconds ago",
      "minute_one": "{count} minute ago",
      "minute_other": "{count} minutes ago",
      "hour_one": "{count} hour ago",
      "hour_other": "{count} hours ago",
      "day_one": "{count} day ago",
      "day_other": "{count} days ago",
      "month_one": "{count} month ago",
      "month_other": "{count} months ago",
      "year_one": "{count} year ago",
      "year_other": "{count} years ago"
    },
    "loading": "Loading, please wait...",
    "error": {
      "title": "Something Went Wrong",
      "message": "We couldn't load the plumber data. Please check your connection and try again.",
      "retry": "Try Again"
    },
    "about": {
      "title": "About Us",
      "p1": "Welcome to Plombier Maroc, the first website dedicated to helping plumbers in Morocco find work and connect with customers.",
      "p2": "We started this platform in 2025 with a simple mission: to bridge the gap between skilled plumbing professionals and the clients who need their services. We are passionate about supporting local tradespeople and making it easier than ever to find reliable help.",
      "p3": "We hope you find our directory useful. If you have any questions or comments, please don't hesitate to contact us."
    },
    "contact": {
      "title": "Contact Us",
      "p1": "Have a question or feedback? We'd love to hear from you. Reach out to us through the channels below.",
      "emailLabel": "Email",
      "phoneLabel": "Phone"
    },
    "privacy": {
      "title": "Privacy Policy",
      "s1": {
        "title": "Introduction",
        "p1": "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights. We use Your Personal data to provide and improve the Service."
      },
      "s2": {
        "title": "Information We Collect",
        "p1": "While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to:",
        "l1": "Contact information (such as name, phone number).",
        "l2": "Geolocation data (if you choose to provide it)."
      },
      "s3": {
        "title": "Use of Your Personal Data",
        "p1": "The Company may use Personal Data for the following purposes: to provide and maintain our Service, to manage Your account, and to contact You."
      },
      "s4": {
        "title": "Disclaimer of Responsibility",
        "p1": "Plombier Maroc is a directory service that connects clients with plumbing professionals. We are not a party to any agreement or transaction between the client and the plumber. We do not guarantee the quality, safety, or legality of the services provided by the plumbers listed in our directory. Any disputes or issues that arise from the services provided are the sole responsibility of the client and the plumber involved. We are not liable for any damages, losses, or problems of any kind."
      }
    },
    "footer": { "copyright": "© {year} Plombier Maroc. All rights reserved.", "tagline": "Connecting you with trusted local plumbers.", "about": "About Us", "privacy": "Privacy Policy", "contact": "Contact Us", "developedBy": "Proudly developed by El Hendouz Youssef" },
    "common": {
      "scrollToTop": "Scroll to top",
      "advertisement": "Advertisement"
    },
    "gdpr": {
      "message": "We use cookies to ensure you get the best experience on our website. Please review our",
      "privacyLink": "Privacy Policy",
      "accept": "Accept",
      "decline": "Decline"
    },
    "mapPage": {
      "title": "Plumbers on the Map",
      "subtitle": "Find professionals near you with an interactive map.",
      "loadingLocation": "Loading map and your location..."
    }
  },
  fr: {
    "header": { "title": "Plombier Maroc", "register": "Rejoindre", "findPlumber": "Trouver un Plombier" },
    "home": { "title": "Votre <1>Plombier<1> de Confiance à portée de clic.", "subtitle": "Rejoignez le principal annuaire de plombiers professionnels au Maroc. Inscrivez-vous en quelques minutes et connectez-vous avec des centaines de clients dans votre ville dès aujourd'hui.", "imageAlt": "Outils de plomberie" },
    "form": { 
      "namePlaceholder": "Nom complet", 
      "phonePlaceholder": "600123456", 
      "bioPlaceholder": "Votre biographie professionnelle (Optionnel)", 
      "addressPlaceholder": "Adresse (Optionnel)",
      "selectCityPlaceholder": "Sélectionnez une ville", 
      "submitButton": "Rejoindre l'Annuaire Maintenant", 
      "successMessage": "Succès ! Votre profil a été ajouté à l'annuaire.", 
      "submitError": "Une erreur s'est produite lors de la soumission de votre profil. Veuillez réessayer.", 
      "photoCta": "Télécharger une photo (Optionnel)", 
      "getLocationButton": "Obtenir l'emplacement (Optionnel)", 
      "locationFetching": "Obtention de votre position...", 
      "locationSuccess": "Emplacement capturé !", 
      "locationError": "Impossible d'obtenir l'emplacement. Veuillez autoriser la permission.",
      "imagePreviewAlt": "Aperçu du profil",
      "removeImageLabel": "Supprimer l'image",
      "submitting": "Envoi en cours...",
      "validation": {
        "nameRequired": "Le nom est requis.",
        "phoneRequired": "Le numéro de téléphone est requis.",
        "phoneInvalid": "Veuillez entrer un numéro valide à 9 chiffres (commençant par 6 ou 7).",
        "cityRequired": "La ville est requise.",
        "imageType": "Type de fichier invalide. Veuillez télécharger un JPG, PNG ou GIF.",
        "imageSize": "Le fichier est trop volumineux. La taille maximale est de 5 Mo."
      }
    },
    "directory": { 
      "title": "Annuaire des Plombiers", 
      "subtitle": "Trouvez et contactez des plombiers professionnels près de chez vous.", 
      "filterLabel": "Filtrer par ville :", 
      "allCities": "Toutes", 
      "noPlumbersTitle": "Aucun Plombier Trouvé", 
      "noPlumbersMessage": "Il n'y a aucun plombier listé pour \"{city}\". Essayez de sélectionner une autre ville ou revenez plus tard.",
      "searchPlaceholder": "Rechercher par nom, ville, ou adresse...",
      "noSearchResults": "Aucun plombier trouvé correspondant à \"{query}\".",
      "bestRated": "Mieux Notés",
      "mostLiked": "Plus Aimés",
      "plumbersFound_one": "Affichage de 1 plombier.",
      "plumbersFound_other": "Affichage de {count} plombiers."
    },
    "card": { 
        "callNow": "Appeler Maintenant ({phone})", 
        "call": "Appeler", 
        "ratingAverage_one": "sur {count} avis",
        "ratingAverage_other": "sur {count} avis", 
        "noRatings": "Aucun avis pour le moment", 
        "ratingThankYou": "Merci pour votre retour !", 
        "verified": "Vérifié",
        "new": "Nouveau",
        "comments_one": "{count} commentaire",
        "comments_other": "{count} commentaires"
    },
    "plumberDetail": {
        "backToDirectory": "Retour à l'annuaire",
        "commentsTitle": "Commentaires et Avis",
        "noComments": "Aucun commentaire pour le moment. Soyez le premier à en laisser un !",
        "commentFormTitle": "Laissez un commentaire",
        "commentSuccess": "Commentaire publié avec succès !",
        "commentError": "Échec de la publication du commentaire. Veuillez réessayer.",
        "noBio": "Aucune biographie fournie."
    },
    "commentForm": {
        "namePlaceholder": "Votre nom",
        "commentPlaceholder": "Écrivez votre commentaire ici...",
        "submitButton": "Publier le commentaire",
        "submitting": "Publication...",
        "validation": {
            "nameRequired": "Le nom est requis.",
            "commentRequired": "Le commentaire ne peut pas être vide."
        }
    },
    "timeAgo": {
      "justNow": "À l'instant",
      "second_one": "Il y a {count} seconde",
      "second_other": "Il y a {count} secondes",
      "minute_one": "Il y a {count} minute",
      "minute_other": "Il y a {count} minutes",
      "hour_one": "Il y a {count} heure",
      "hour_other": "Il y a {count} heures",
      "day_one": "Il y a {count} jour",
      "day_other": "Il y a {count} jours",
      "month_one": "Il y a {count} mois",
      "month_other": "Il y a {count} mois",
      "year_one": "Il y a {count} an",
      "year_other": "Il y a {count} ans"
    },
    "loading": "Chargement en cours, veuillez patienter...",
    "error": {
      "title": "Une erreur est survenue",
      "message": "Nous n'avons pas pu charger les données des plombiers. Veuillez vérifier votre connexion et réessayer.",
      "retry": "Réessayer"
    },
    "about": {
      "title": "À Propos de Nous",
      "p1": "Bienvenue sur Plombier Maroc, le premier site web dédié à aider les plombiers au Maroc à trouver du travail et à se connecter avec des clients.",
      "p2": "Nous avons lancé cette plateforme en 2025 avec une mission simple : combler le fossé entre les plombiers professionnels qualifiés et les clients qui ont besoin de leurs services. Nous sommes passionnés par le soutien aux artisans locaux et par la simplification de la recherche d'une aide fiable.",
      "p3": "Nous espérons que vous trouverez notre annuaire utile. Si vous avez des questions ou des commentaires, n'hésitez pas à nous contacter."
    },
    "contact": {
      "title": "Contactez-Nous",
      "p1": "Vous avez une question ou un commentaire ? Nous serions ravis de vous entendre. Contactez-nous via les canaux ci-dessous.",
      "emailLabel": "Email",
      "phoneLabel": "Téléphone"
    },
    "privacy": {
      "title": "Politique de Confidentialité",
      "s1": {
        "title": "Introduction",
        "p1": "Cette politique de confidentialité décrit nos politiques et procédures sur la collecte, l'utilisation et la divulgation de vos informations lorsque vous utilisez le Service et vous informe de vos droits à la vie privée. Nous utilisons vos données personnelles pour fournir et améliorer le Service."
      },
      "s2": {
        "title": "Informations que nous collectons",
        "p1": "Lors de l'utilisation de notre Service, nous pouvons vous demander de nous fournir certaines informations personnellement identifiables qui peuvent être utilisées pour vous contacter ou vous identifier. Les informations personnellement identifiables peuvent inclure, mais sans s'y limiter :",
        "l1": "Informations de contact (telles que le nom, le numéro de téléphone).",
        "l2": "Données de géolocalisation (si vous choisissez de les fournir)."
      },
      "s3": {
        "title": "Utilisation de vos données personnelles",
        "p1": "L'entreprise peut utiliser les données personnelles aux fins suivantes : pour fournir et maintenir notre Service, pour gérer votre compte et pour vous contacter."
      },
      "s4": {
        "title": "Clause de non-responsabilité",
        "p1": "Plombier Maroc est un service d'annuaire qui met en relation les clients avec des professionnels de la plomberie. Nous ne sommes partie à aucun accord ou transaction entre le client et le plombier. Nous ne garantissons pas la qualité, la sécurité ou la légalité des services fournis par les plombiers répertoriés dans notre annuaire. Tout litige ou problème découlant des services fournis relève de la seule responsabilité du client et du plombier concernés. Nous ne sommes pas responsables des dommages, pertes ou problèmes de quelque nature que ce soit."
      }
    },
    "footer": { "copyright": "© {year} Plombier Maroc. Tous droits réservés.", "tagline": "Vous connecter avec des plombiers locaux de confiance.", "about": "À Propos", "privacy": "Confidentialité", "contact": "Contact", "developedBy": "Fièrement développé par El Hendouz Youssef" },
    "common": {
      "scrollToTop": "Remonter en haut",
      "advertisement": "Publicité"
    },
    "gdpr": {
      "message": "Nous utilisons des cookies pour vous garantir la meilleure expérience sur notre site. Veuillez consulter notre",
      "privacyLink": "Politique de Confidentialité",
      "accept": "Accepter",
      "decline": "Refuser"
    },
    "mapPage": {
      "title": "Plombiers sur la Carte",
      "subtitle": "Trouvez des professionnels près de chez vous avec une carte interactive.",
      "loadingLocation": "Chargement de la carte et de votre position..."
    }
  },
  ar: {
    "header": { "title": "سباك المغرب", "register": "انضم للدليل", "findPlumber": "ابحث عن سباك" },
    "home": { "title": "<1>السباك<1> الموثوق به على بعد نقرة واحدة.", "subtitle": "انضم إلى الدليل الأول للسباكين المحترفين في المغرب. سجل في دقائق وتواصل مع مئات العملاء في مدينتك اليوم.", "imageAlt": "أدوات السباكة" },
    "form": { 
      "namePlaceholder": "الاسم الكامل", 
      "phonePlaceholder": "600123456", 
      "bioPlaceholder": "سيرتك المهنية (اختياري)", 
      "addressPlaceholder": "عنوان الشارع (اختياري)",
      "selectCityPlaceholder": "اختر مدينة", 
      "submitButton": "انضم إلى الدليل الآن", 
      "successMessage": "نجاح! لقد تم إضافة ملفك الشخصي إلى الدليل.", 
      "submitError": "حدث خطأ أثناء إرسال ملفك الشخصي. الرجاء المحاولة مرة أخرى.", 
      "photoCta": "تحميل صورة (اختياري)", 
      "getLocationButton": "الحصول على الموقع (اختياري)", 
      "locationFetching": "جاري تحديد موقعك...", 
      "locationSuccess": "تم تحديد الموقع!", 
      "locationError": "تعذر الحصول على الموقع. يرجى السماح بالإذن.",
      "imagePreviewAlt": "معاينة الملف الشخصي",
      "removeImageLabel": "إزالة الصورة",
      "submitting": "جاري الإرسال...",
      "validation": {
        "nameRequired": "الاسم مطلوب.",
        "phoneRequired": "رقم الهاتف مطلوب.",
        "phoneInvalid": "الرجاء إدخال رقم هاتف صالح مكون من 9 أرقام (يبدأ بـ 6 أو 7).",
        "cityRequired": "المدينة مطلوبة.",
        "imageType": "نوع الملف غير صالح. يرجى تحميل ملف JPG أو PNG أو GIF.",
        "imageSize": "الملف كبير جدًا. الحجم الأقصى هو 5 ميجابايت."
      }
    },
    "directory": { 
      "title": "دليل السباكين", 
      "subtitle": "ابحث عن سباكين محترفين بالقرب منك واتصل بهم.", 
      "filterLabel": "تصفية حسب المدينة:", 
      "allCities": "الكل", 
      "noPlumbersTitle": "لم يتم العثور على سباكين", 
      "noPlumbersMessage": "لا يوجد سباكون مدرجون في \"{city}\". حاول اختيار مدينة أخرى أو تحقق مرة أخرى لاحقًا.",
      "searchPlaceholder": "البحث بالاسم أو المدينة أو العنوان...",
      "noSearchResults": "لم يتم العثور على سباكين يطابقون \"{query}\".",
      "bestRated": "الأعلى تقييماً",
      "mostLiked": "الأكثر إعجاباً",
      "plumbersFound_zero": "عرض ٠ نتائج.",
      "plumbersFound_one": "عرض سباك واحد.",
      "plumbersFound_two": "عرض سباكين.",
      "plumbersFound_few": "عرض {count} سباكين.",
      "plumbersFound_many": "عرض {count} سباكًا.",
      "plumbersFound_other": "عرض {count} سباك."
    },
    "card": { 
        "callNow": "اتصل الآن ({phone})", 
        "call": "اتصل الآن", 
        "ratingAverage_one": "من تقييم واحد",
        "ratingAverage_two": "من تقييمين",
        "ratingAverage_few": "من {count} تقييمات",
        "ratingAverage_many": "من {count} تقييمًا",
        "ratingAverage_other": "من {count} تقييم",
        "noRatings": "لا توجد تقييمات بعد", 
        "ratingThankYou": "شكرا لملاحظاتك!", 
        "verified": "موثوق",
        "new": "جديد",
        "comments_zero": "٠ تعليقات",
        "comments_one": "تعليق واحد",
        "comments_two": "تعليقان",
        "comments_few": "{count} تعليقات",
        "comments_many": "{count} تعليقًا",
        "comments_other": "{count} تعليق"
    },
    "plumberDetail": {
        "backToDirectory": "العودة إلى الدليل",
        "commentsTitle": "التعليقات والآراء",
        "noComments": "لا توجد تعليقات حتى الآن. كن أول من يترك تعليقًا!",
        "commentFormTitle": "اترك تعليقًا",
        "commentSuccess": "تم نشر التعليق بنجاح!",
        "commentError": "فشل نشر التعليق. يرجى المحاولة مرة أخرى.",
        "noBio": "لم يتم تقديم سيرة ذاتية."
    },
    "commentForm": {
        "namePlaceholder": "اسمك",
        "commentPlaceholder": "اكتب تعليقك هنا...",
        "submitButton": "انشر التعليق",
        "submitting": "جاري النشر...",
        "validation": {
            "nameRequired": "الاسم مطلوب.",
            "commentRequired": "لا يمكن أن يكون التعليق فارغًا."
        }
    },
    "timeAgo": {
      "justNow": "الآن",
      "second_one": "منذ ثانية واحدة",
      "second_two": "منذ ثانيتين",
      "second_few": "منذ {count} ثوان",
      "second_many": "منذ {count} ثانية",
      "second_other": "منذ {count} ثانية",
      "minute_one": "منذ دقيقة واحدة",
      "minute_two": "منذ دقيقتين",
      "minute_few": "منذ {count} دقائق",
      "minute_many": "منذ {count} دقيقة",
      "minute_other": "منذ {count} دقيقة",
      "hour_one": "منذ ساعة واحدة",
      "hour_two": "منذ ساعتين",
      "hour_few": "منذ {count} ساعات",
      "hour_many": "منذ {count} ساعة",
      "hour_other": "منذ {count} ساعة",
      "day_one": "منذ يوم واحد",
      "day_two": "منذ يومين",
      "day_few": "منذ {count} أيام",
      "day_many": "منذ {count} يومًا",
      "day_other": "منذ {count} يوم",
      "month_one": "منذ شهر واحد",
      "month_two": "منذ شهرين",
      "month_few": "منذ {count} أشهر",
      "month_many": "منذ {count} شهرًا",
      "month_other": "منذ {count} شهر",
      "year_one": "منذ عام واحد",
      "year_two": "منذ عامين",
      "year_few": "منذ {count} أعوام",
      "year_many": "منذ {count} عامًا",
      "year_other": "منذ {count} عام"
    },
    "loading": "جاري التحميل، يرجى الانتظار...",
    "error": {
      "title": "حدث خطأ ما",
      "message": "لم نتمكن من تحميل بيانات السباكين. يرجى التحقق من اتصالك والمحاولة مرة أخرى.",
      "retry": "إعادة المحاولة"
    },
    "about": {
      "title": "من نحن",
      "p1": "أهلاً بك في سباك المغرب، أول موقع إلكتروني مخصص لمساعدة السباكين في المغرب على إيجاد فرص عمل والتواصل مع العملاء.",
      "p2": "أطلقنا هذه المنصة في عام 2025 بمهمة بسيطة: سد الفجوة بين محترفي السباكة المهرة والعملاء الذين يحتاجون إلى خدماتهم. نحن متحمسون لدعم الحرفيين المحليين وتسهيل العثور على مساعدة موثوقة أكثر من أي وقت مضى.",
      "p3": "نأمل أن تجد دليلنا مفيدًا. إذا كان لديك أي أسئلة أو تعليقات، فلا تتردد في الاتصال بنا."
    },
    "contact": {
      "title": "اتصل بنا",
      "p1": "هل لديك سؤال أو ملاحظة؟ نود أن نسمع منك. تواصل معنا عبر القنوات أدناه.",
      "emailLabel": "البريد الإلكتروني",
      "phoneLabel": "الهاتف"
    },
    "privacy": {
      "title": "سياسة الخصوصية",
      "s1": {
        "title": "مقدمة",
        "p1": "تصف سياسة الخصوصية هذه سياساتنا وإجراءاتنا بشأن جمع واستخدام والكشف عن معلوماتك عند استخدامك للخدمة وتخبرك بحقوق الخصوصية الخاصة بك. نحن نستخدم بياناتك الشخصية لتقديم الخدمة وتحسينها."
      },
      "s2": {
        "title": "المعلومات التي نجمعها",
        "p1": "أثناء استخدام خدمتنا، قد نطلب منك تزويدنا ببعض المعلومات الشخصية التي يمكن استخدامها للاتصال بك أو التعرف عليك. قد تشمل المعلومات الشخصية، على سبيل المثال لا الحصر:",
        "l1": "معلومات الاتصال (مثل الاسم ورقم الهاتف).",
        "l2": "بيانات الموقع الجغرافي (إذا اخترت تقديمها)."
      },
      "s3": {
        "title": "استخدام بياناتك الشخصية",
        "p1": "قد تستخدم الشركة البيانات الشخصية للأغراض التالية: لتوفير خدمتنا وصيانتها، وإدارة حسابك، والاتصال بك."
      },
      "s4": {
        "title": "إخلاء مسؤولية",
        "p1": "سباك المغرب هو خدمة دليل تربط العملاء بمهنيي السباكة. نحن لسنا طرفًا في أي اتفاق أو معاملة بين العميل والسباك. نحن لا نضمن جودة أو سلامة أو قانونية الخدمات التي يقدمها السباكون المدرجون في دليلنا. أي نزاعات أو مشاكل تنشأ عن الخدمات المقدمة هي مسؤولية العميل والسباك المعنيين وحدهما. نحن غير مسؤولين عن أي أضرار أو خسائر أو مشاكل من أي نوع."
      }
    },
    "footer": { "copyright": "© {year} سباك المغرب. جميع الحقوق محفوظة.", "tagline": "نوصلك بسباكين محليين موثوقين.", "about": "من نحن", "privacy": "الخصوصية", "contact": "اتصل بنا", "developedBy": "تم التطوير بفخر بواسطة الهندوز يوسف" },
    "common": {
      "scrollToTop": "العودة إلى الأعلى",
      "advertisement": "إعلان"
    },
    "gdpr": {
      "message": "نحن نستخدم ملفات تعريف الارتباط لضمان حصولك على أفضل تجربة على موقعنا. يرجى مراجعة",
      "privacyLink": "سياسة الخصوصية",
      "accept": "قبول",
      "decline": "رفض"
    },
    "mapPage": {
      "title": "سباكون على الخريطة",
      "subtitle": "اعثر على محترفين بالقرب منك باستخدام خريطة تفاعلية.",
      "loadingLocation": "جاري تحميل الخريطة وموقعك..."
    }
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const getNestedValue = (obj: any, path: string): any => {
  if (typeof obj !== 'object' || obj === null) {
    return undefined;
  }
  return path.split('.').reduce((acc, part) => {
    if (acc === undefined || acc === null) {
      return undefined;
    }
    return acc[part];
  }, obj);
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ar');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language;
    
    if (savedLang && ['en', 'fr', 'ar'].includes(savedLang)) {
        setLanguage(savedLang);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string, replacements?: { [key: string]: string | number }): string => {
    const getTranslation = (lang: Language, lookupKey: string): string | undefined => {
        const value = getNestedValue(translations[lang], lookupKey);
        return typeof value === 'string' ? value : undefined;
    };

    let translation: string | undefined;

    if (replacements && typeof replacements.count === 'number') {
        const count = replacements.count;
        try {
            // 1. Check current language for specific plural category
            const pluralRules = new Intl.PluralRules(language);
            const category = pluralRules.select(count);
            translation = getTranslation(language, `${key}_${category}`);
            
            // 2. Fallback to 'other' in current language
            if (translation === undefined) {
                translation = getTranslation(language, `${key}_other`);
            }
            
            // 3. Fallback to English if still not found
            if (translation === undefined && language !== 'en') {
                const enPluralRules = new Intl.PluralRules('en');
                const enCategory = enPluralRules.select(count);
                translation = getTranslation('en', `${key}_${enCategory}`);
                
                if (translation === undefined) {
                    translation = getTranslation('en', `${key}_other`);
                }
            }
        } catch(e) {
            console.error(`Error during pluralization for key "${key}":`, e);
            // If pluralization system itself fails, try a simple lookup as a last resort
            translation = getTranslation(language, key) ?? getTranslation('en', key);
        }
    } else {
        // Simple key lookup for non-pluralized strings
        translation = getTranslation(language, key);
        if (translation === undefined && language !== 'en') {
            translation = getTranslation('en', key);
        }
    }

    // Final fallback to the key itself
    const finalText = translation ?? key;

    // Apply replacements
    if (replacements) {
        return Object.entries(replacements).reduce(
            (acc, [k, v]) => acc.replace(new RegExp(`{${k}}`, 'g'), String(v)),
            finalText
        );
    }
    
    return finalText;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};