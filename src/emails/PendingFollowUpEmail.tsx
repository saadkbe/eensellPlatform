import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";

interface PendingFollowUpEmailProps {
  userName: string;
  remainingSpots: number;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eensell.com";

export const PendingFollowUpEmail = ({
  userName = "There",
  remainingSpots = 5,
}: PendingFollowUpEmailProps) => {
  const previewText = `Ne payez pas 599 MAD pour ça... (ouvrez immédiatement) ⏳`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Action Requise / إجراء مطلوب ⏳</Heading>
          
          <Section style={section}>
            <Text style={text}>Bonjour {userName} / مرحباً {userName},</Text>
            
            {/* French Version */}
            <Text style={text}>
              Vous n'êtes plus qu'à une étape de rejoindre le Challenge de 60 Jours, mais nous avons remarqué que votre inscription est toujours en attente.
            </Text>
            <Text style={text}>
              Actuellement, vous avez une place réservée pour y accéder à seulement <strong style={highlightText}>200 MAD</strong> (au lieu du tarif normal de 599 MAD). Cependant, il ne nous reste que <strong style={highlightText}>{remainingSpots} places</strong> à ce tarif réduit. Une fois ces dernières places prises, les inscriptions fermeront et le prix remontera à 599 MAD.
            </Text>
            <Text style={text}>
              Si vous hésitez encore, nous venons de publier une nouvelle vidéo expliquant étape par étape exactement ce que vous accomplirez lors de ce Challenge de 60 Jours.
            </Text>

            <Hr style={hr} />

            {/* Arabic Version */}
            <Text style={textRtl}>
              أنت على بعد خطوة واحدة من الانضمام إلى تحدي الـ 60 يومًا، لكننا لاحظنا أن تسجيلك لا يزال قيد الانتظار.
            </Text>
            <Text style={textRtl}>
              في الوقت الحالي، لديك مكان محجوز للانضمام مقابل <strong style={highlightText}>200 درهم</strong> فقط (بدلاً من السعر العادي 599 درهم). ومع ذلك، لم يتبق لدينا سوى <strong style={highlightText}>{remainingSpots} مقاعد</strong> بهذا السعر المخفض. بمجرد شغل هذه المقاعد الأخيرة، ستُغلق الأبواب وسيعود السعر إلى 599 درهم.
            </Text>
            <Text style={textRtl}>
              إذا كنت لا تزال متردداً، فقد أصدرنا للتو مقطع فيديو جديد يشرح خطوة بخطوة ما ستحققه بالضبط داخل تحدي الـ 60 يومًا.
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`${baseUrl}/pending`}>
                Visionner la Vidéo & Réserver ma Place (200 MAD)
                <br />
                <span style={buttonAr}>شاهد الفيديو واحجز مقعدي</span>
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footerText}>
              Nous ne pouvons pas conserver les comptes en attente indéfiniment. Si vous ne finalisez pas votre inscription rapidement, votre place sera cédée à la prochaine personne sur la liste d'attente.
            </Text>
            
            <Text style={footerTextRtl}>
              لا يمكننا الاحتفاظ بالحسابات المعلقة إلى أجل غير مسمى. إذا لم تكمل تسجيلك قريباً، فسيتم منح مكانك للشخص التالي في قائمة الانتظار.
            </Text>

            <Text style={footerText}>
              À très vite à l'intérieur, / نراك بالداخل،<br />
              L'équipe Eensell University / فريق Eensell University
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default PendingFollowUpEmail;

const main = {
  backgroundColor: "#0B1120", // Dark blue theme requested by user
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "100%",
  maxWidth: "600px",
};

const section = {
  padding: "32px",
  backgroundColor: "#131E32", // Slightly lighter dark blue for the card
  border: "1px solid #1E2D4A",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
};

const h1 = {
  color: "#F1F5F9",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const text = {
  color: "#CBD5E1",
  fontSize: "15px",
  lineHeight: "24px",
  marginBottom: "16px",
};

const textRtl = {
  ...text,
  textAlign: "right" as const,
  direction: "rtl" as const,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const highlightText = {
  color: "#F59E0B", // Orange goldish
};

const hr = {
  borderColor: "#1E2D4A",
  margin: "24px 0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#F59E0B", // Orange goldish button requested
  borderRadius: "8px",
  color: "#0B1120", // Dark text for contrast on gold
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "16px 24px",
  boxShadow: "0 4px 14px 0 rgba(245, 158, 11, 0.39)",
};

const buttonAr = {
  display: "block",
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "normal",
};

const footerText = {
  color: "#94A3B8",
  fontSize: "13px",
  lineHeight: "20px",
  marginBottom: "16px",
};

const footerTextRtl = {
  ...footerText,
  textAlign: "right" as const,
  direction: "rtl" as const,
};
