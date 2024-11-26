"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import Image from "next/image";
import { MoonLoader } from "react-spinners";
import { useUploadImage } from "@/features/billboards/api/use-upload-image";
import { useRemoveImage } from "../api/use-remove-image";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  value: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [uploading, setUploading] = useState(false);
  const { mutate, isPending } = useUploadImage();
  const { mutate: removeImage } = useRemoveImage();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    mutate(formData, {
      onSuccess: (data) => {
        console.log(data);
        onChange([...value, ...(data.uploadedFiles || [])]);
      },
      onError: (error) => {
        console.error("Upload error:", error);
      },
    });
  };

  const handleRemove = async (url: string) => {
    onRemove(url);
    removeImage({ param: { imageUrl: encodeURIComponent(url) } });
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-4">
        {isPending && (
          <div className="w-full flex justify-center items-center mt-10 mb-10">
            <MoonLoader />
          </div>
        )}
        {value.map((url, i) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                type="button"
                onClick={() => handleRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-2 w-4" />
              </Button>
            </div>
            <Image fill className="object-cover" alt="Image" src={url} />
          </div>
        ))}
      </div>

      <div className="flex space-x-2 items-center">
        <Input
          type="file"
          multiple
          onChange={handleUpload}
          disabled={disabled || isPending}
          id="upload"
        />
      </div>
    </>
  );
};
