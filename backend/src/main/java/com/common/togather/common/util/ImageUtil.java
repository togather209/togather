package com.common.togather.common.util;


import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.util.IOUtils;
import com.common.togather.api.error.BadFileExtensionException;
import com.common.togather.api.error.FileEmptyException;
import com.common.togather.api.error.FileSizeException;
import com.common.togather.api.error.FileUploadFailException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class ImageUtil {
    @Value("${aws.s3.bucket}")
    private String bucket;

    @Value("${aws.s3.base-url}")
    private String baseUrl;

    private final static Integer IMAGE_MAX_SIZE = 5 * 1024 * 1024 * 2;
    ;
    private final AmazonS3 amazonS3;

    public String uploadImage(MultipartFile file) {
        return getImageUrl(upload(file));
    }

    private String upload(MultipartFile file) {
        if (file.isEmpty() && file.getOriginalFilename() != null)
            throw new FileEmptyException("파일이 비어있습니다.");

        if (file.getSize() >= IMAGE_MAX_SIZE) {
            throw new FileSizeException("파일 사이즈 제한이 넘었습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        String ext = originalFilename.substring(originalFilename.lastIndexOf(".") + 1);

        if (!(ext.equals("jpg")
                || ext.equals("HEIC")
                || ext.equals("jpeg")
                || ext.equals("png")
                || ext.equals("heic")
                || ext.equals("gif"))) {
            throw new BadFileExtensionException("잘못된 파일 확장자 입니다.");
        }

        String randomName = UUID.randomUUID().toString();
        String fileName = "|" + randomName + "." + ext;

        try {
            ObjectMetadata objectMetadata = new ObjectMetadata();
            byte[] byteArray = IOUtils.toByteArray(file.getInputStream());
            objectMetadata.setContentType(file.getContentType());
            objectMetadata.setContentLength(byteArray.length);
            amazonS3.putObject(new PutObjectRequest(bucket, fileName, file.getInputStream(), objectMetadata).
                    withCannedAcl(CannedAccessControlList.PublicRead));
        } catch (IOException e) {
            throw new FileUploadFailException("파일 업로드 실패 했습니다.");
        }

        log.info("url = {}", fileName);

        return fileName;
    }

    public void deleteImage(String imageUrl) {
        try {
            amazonS3.deleteObject(new DeleteObjectRequest(bucket, extractFileName(imageUrl)));
        } catch (Exception e) {
            throw new RuntimeException();
        }
    }

    private String getImageUrl(String fileName) {
        return baseUrl + "/" + fileName;
    }

    private String extractFileName(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) {
            return null;
        }

        int lastSlashIndex = imageUrl.lastIndexOf('/');
        if (lastSlashIndex == -1) {
            return null;
        }

        return imageUrl.substring(lastSlashIndex + 1);
    }
}
