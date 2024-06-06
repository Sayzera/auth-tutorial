import React from "react";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
export default function ErrorCard() {
  return (
    <CardWrapper
      headerLabel="Opps! Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyiniz."
      backButtonHref="/auth/login"
      backButtonLabel="Giriş ekranına dön"
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="h-10 w-10 text-destructive" />
      </div>
    </CardWrapper>
  );
}
