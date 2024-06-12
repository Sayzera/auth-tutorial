"use client";

import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/actions/new-verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";

const onlyOneRenderFunction = {
  case: false,
};
const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if (success || error) return;

    if (!token) {
      setError("Token bulunamadı!");
      return;
    }
    await newVerification(token)
      .then((data) => {
        setError(data.error);
        setSuccess(data.success);
      })
      .catch(() => {
        setError("Bilinmeyen bir hata oluştu!");
      });
  }, [token, success, error]);

  useEffect(() => {
    if (onlyOneRenderFunction.case === false) {
      onSubmit();
      onlyOneRenderFunction.case = true;
    }
  }, []);

  return (
    <CardWrapper
      headerLabel={
        success
          ? "Doğrulamanız başarıyla onaylandı."
          : "Doğrulamanız onaylanıyor."
      }
      backButtonLabel="Login sayfasına dön"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}

        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
