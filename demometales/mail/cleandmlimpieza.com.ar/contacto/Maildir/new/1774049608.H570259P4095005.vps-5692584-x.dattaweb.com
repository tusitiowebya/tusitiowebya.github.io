Return-path: <rosaveraolga5@gmail.com>
Envelope-to: contacto@cleandmlimpieza.com.ar
Delivery-date: Fri, 20 Mar 2026 20:33:28 -0300
Received: from [74.125.224.41] (helo=mail-yx1-f41.google.com)
	by vps-5692584-x.dattaweb.com with esmtps   (TLS1.3) tls TLS_AES_128_GCM_SHA256
	(Exim)
	 (envelope-from <rosaveraolga5@gmail.com>)
	id 1w3jLJ-00HBI6-Dk
	for contacto@cleandmlimpieza.com.ar; Fri, 20 Mar 2026 20:33:28 -0300
Received: by mail-yx1-f41.google.com with SMTP id 956f58d0204a3-64eaf8aa893so747502d50.3
        for <contacto@cleandmlimpieza.com.ar>; Fri, 20 Mar 2026 16:33:25 -0700 (PDT)
ARC-Seal: i=1; a=rsa-sha256; t=1774049603; cv=none;
        d=google.com; s=arc-20240605;
        b=kXcdxSkX2v+fvZcE/gt5aaXx2JhwmPKzAqehATPrGDa32f1njd0KbRIpaz8x2aaunp
         JwOJxKQHySKYatI+5U4NFmN2u9Br1JgiHRddWSyOxJdsiz/ZTxnBT0cOh2mTYuOC+cpq
         sH8XUFeqHDlFaqZRYiBu6FOxeVgm+brepl58iC4GEKXx5hHffsPxwivYP9NA4qyco4nr
         X5yBkQgC+q07HvwzAFvJexSjnXzZEawsZp4u6V0Rt4Se+h6cefAqhs3YYq3LVs/t/+im
         qju9oVfU9R6G2kBzQ0qfnTp9QI2XxkavzT1JPwDXT3e1rQ5jmo6CJerGDUwOuKkufXk3
         IrWA==
ARC-Message-Signature: i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20240605;
        h=to:subject:message-id:date:from:mime-version:dkim-signature;
        bh=ZF4tLQMWtTvv2QbrSLOgePN4L08QAErxj1OCBBY4BzQ=;
        fh=lSb/8DteXe002rldwXhYBPqyok6jNVP3v7/yyEMHDAw=;
        b=dKi5QUYvRk8rjivEoa4I2UpvLYjdxaNQNFL/hLc23EuAu92kt8iaezLs10ktwz7ghj
         rLBih3yEeqtBZqzvY+4XKpaZiuTQogUOUbnFqFNUA/2CTgzoQiwi+c6t1JsvfF0S8msy
         tqW9Tjkfwy+L5bZjOD9xNvAfQbj8SYAvfiLC21TbZfoiwckWsGqtAiqnwjXwhOlpixZ/
         v4wXMjLhd3CgFY+K5fiQQ6pE8w7I9VSb/nocTU4bWuhh21UlA/uAPlnsZo1h7oUxXg6u
         NRPpZj+RdePokiqA8tTYm3caYmK2LN66T27QXXKD2S3MD4TGKmFJxPSEOOcoB/TY58fL
         l+VQ==;
        darn=cleandmlimpieza.com.ar
ARC-Authentication-Results: i=1; mx.google.com; arc=none
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=gmail.com; s=20230601; t=1774049603; x=1774654403; darn=cleandmlimpieza.com.ar;
        h=to:subject:message-id:date:from:mime-version:from:to:cc:subject
         :date:message-id:reply-to;
        bh=ZF4tLQMWtTvv2QbrSLOgePN4L08QAErxj1OCBBY4BzQ=;
        b=aUdqr2CE5VNFIn2zS3jtm788dXf9IS+cIW1gBLkmT/i+H6MjiNk/Nt0DH5Qi6TAO+r
         /7lIZCAOfPiHZVpV/Lc6MFCi1vdKJNN3U3X/x/KMxHI5IohgM1xoq+lQRRFFiHY48U8F
         tE72YNz30eB8SskG8ykEYlQ680nkkGBBmCAtJp2uuDAVXe+0lzyamcAx1Ba+3czkO9jQ
         9w69NTRs6fskH1faahKvCo8zjmHiio23u6jQpls/U3m4W7ntfbA1myxhDLkeqxpEaCMp
         JOBikjanmvGAtmB34cHw2YutNEr5tiqrV5KJiajp1ooxP3Jzk2igfQqCQGV+LfZ7Xcrs
         E+Iw==
X-Google-DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
        d=1e100.net; s=20251104; t=1774049603; x=1774654403;
        h=to:subject:message-id:date:from:mime-version:x-gm-gg
         :x-gm-message-state:from:to:cc:subject:date:message-id:reply-to;
        bh=ZF4tLQMWtTvv2QbrSLOgePN4L08QAErxj1OCBBY4BzQ=;
        b=Yxl8adM6mbvMUQh31NWBwx1TrdyZ1mGPmvOaDZrLF/hdy7PleTBSPWWUnsvIlaB01r
         43NnPbi1gnUhQiUMHnWgUoInrF80thpDfKg8v8kV0NC/2ek7vfCy+En+uD+ahsGdmQ8N
         erR1VZk5GqNHj2MPDtxBTQb+n3u7bfUggpFNkjfIEhDEfUOMmRc2fgXlnTCGca9WJG6Z
         Zf2MDuWPXOS8F7DPSAAZLiB/SkEw9/C5XX9vRRo0/Hg/vpom+ejPFvVdVukiUY0q5jj6
         eAnHy2jt/Ysh35/3elhFgx45tIFtCViOXWuEMsI1A5pLBW+Nlkhuamv+ZwnEcOEPbyHM
         xbog==
X-Gm-Message-State: AOJu0YyA6c2MINq300QMsJmXTWLPLZzVZWveCse/qlQMbFdkWp88Xy8Z
	wzcCnmbzxjvYcXXJm/zzofOmk1Rb9ec9hv78VwJ0gWIOYTpxALZS9HOPdGKt4Q/rcM+8pUMak/i
	mfdokAvff9dsquE7MRPhPWcpTfy0XMLRKtZ0u
X-Gm-Gg: ATEYQzy0y/azQcDef3ZtVDbxF52IlWMQTSF2snlm99CKklzHmBnOQrdJ7Ne7jtJnJ44
	Oocyj9aMM2UDSKMsGhWk9WVsRIe5aM3kKkdvlTFkeR0rH3GuSHYHaegCDVknessMPRIu1XGrnaT
	wovMBHoFj+REqmvLT+lOh8Oy4fQ+Df6BIWWOCjLa/Y8N7cHmvFXkHd2eLSsbdsbiSd61KGmLT/5
	hTefKTUHGxc1t5ZDOajW4dc7jQXc6yxkBsxdO0c5zWiV135sFfIbpjbnBelYnQ9PchKdQEqeyVL
	tFJ0
X-Received: by 2002:a05:690e:16d5:b0:64e:a65d:5221 with SMTP id
 956f58d0204a3-64eaa6bec07mr3919015d50.18.1774049602737; Fri, 20 Mar 2026
 16:33:22 -0700 (PDT)
MIME-Version: 1.0
From: Rosa Vera <rosaveraolga5@gmail.com>
Date: Fri, 20 Mar 2026 20:33:12 -0300
X-Gm-Features: AaiRm50hj5MlE1ZZMUIhUrXe4j7UIOE6_gEszxUrUjcGYhdMPFW3szeEFtZ5kCM
Message-ID: <CA+5GH+TaDn0pMM5NsMUkK7cx3T+maqSg=+eXRgUHh0VyVkhvLg@mail.gmail.com>
Subject: BUSQUEDA LABORAL//CV
To: contacto@cleandmlimpieza.com.ar
Content-Type: multipart/mixed; boundary="00000000000062d058064d7d1c7c"
X-VirusChecked: Checked
X-Spam-Score: -2.4
X-Spam-Score-Int: -23
X-Spam-Bar: --
X-Spam-Report: Action: no action
 Symbol: FROM_HAS_DN(0.00)
 Symbol: FROM_EQ_ENVFROM(0.00)
 Symbol: RCVD_COUNT_TWO(0.00)
 Symbol: TO_DN_NONE(0.00)
 Symbol: PREVIOUSLY_DELIVERED(0.00)
 Symbol: MID_RHS_MATCH_FROMTLD(0.00)
 Symbol: MIME_GOOD(-0.10)
 Symbol: RWL_MAILSPIKE_POSSIBLE(0.00)
 Symbol: R_SPF_ALLOW(0.00)
 Symbol: ARC_ALLOW(0.00)
 Symbol: ASN(0.00)
 Symbol: MISSING_XM_UA(0.77)
 Symbol: BAD_REP_POLICIES(1.00)
 Symbol: HAS_ATTACHMENT(0.00)
 Symbol: DMARC_POLICY_ALLOW(0.00)
 Symbol: SUBJ_ALL_CAPS(0.50)
 Symbol: DKIM_TRACE(0.00)
 Symbol: BAYES_HAM(-4.86)
 Symbol: MX_GOOD(0.00)
 Symbol: RCVD_TLS_LAST(0.00)
 Symbol: R_DKIM_ALLOW(0.00)
 Symbol: TO_MATCH_ENVRCPT_ALL(0.00)
 Symbol: FUZZY_RATELIMITED(0.00)
 Symbol: URIBL_HOSTKARMA_YELLOW(0.30)
 Symbol: RCPT_COUNT_ONE(0.00)
 Symbol: MIME_TRACE(0.00)
 Symbol: FREEMAIL_FROM(0.00)
 Symbol: FREEMAIL_ENVFROM(0.00)
 Message-ID: CA+5GH+TaDn0pMM5NsMUkK7cx3T+maqSg=+eXRgUHh0VyVkhvLg@mail.gmail.com
X-Spam-Flag: No
X-Spam-Status: No
X-Spam-Threshold: 70

--00000000000062d058064d7d1c7c
Content-Type: multipart/alternative; boundary="00000000000062d056064d7d1c7a"

--00000000000062d056064d7d1c7a
Content-Type: text/plain; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

Buenos d=C3=ADas,

Me pongo en contacto con ustedes para enviarles mi CV y postularme a la
vacante de personal de limpieza en su organizaci=C3=B3n.

Cuento con experiencia previa realizando tareas de mantenimiento, higiene y
desinfecci=C3=B3n en distintos =C3=A1mbitos laborales, lo que me ha permiti=
do
desarrollar agilidad y un alto est=C3=A1ndar de detalle en mi trabajo. Soy =
una
persona puntual, comprometida y con total disponibilidad horaria para
incorporarme de inmediato.

Agradezco de antemano su tiempo y quedo a disposici=C3=B3n para concertar u=
na
entrevista.

Saludos cordiales,

--00000000000062d056064d7d1c7a
Content-Type: text/html; charset="UTF-8"
Content-Transfer-Encoding: quoted-printable

<div dir=3D"ltr"><p>Buenos d=C3=ADas,</p><p>Me pongo en contacto con ustede=
s para enviarles mi CV y postularme a la vacante de personal de limpieza en=
 su organizaci=C3=B3n.</p><p>Cuento con experiencia previa realizando tarea=
s de mantenimiento, higiene y desinfecci=C3=B3n en distintos =C3=A1mbitos l=
aborales, lo que me ha permitido desarrollar agilidad y un alto est=C3=A1nd=
ar de detalle en mi trabajo. Soy una persona puntual, comprometida y con to=
tal disponibilidad horaria para incorporarme de inmediato.</p><p>Agradezco =
de antemano su tiempo y quedo a disposici=C3=B3n para concertar una entrevi=
sta.</p><p>Saludos cordiales,</p></div>

--00000000000062d056064d7d1c7a--
--00000000000062d058064d7d1c7c
Content-Type: application/pdf; name="CV_Rosa_Olga_Vera.pdf"
Content-Disposition: attachment; filename="CV_Rosa_Olga_Vera.pdf"
Content-Transfer-Encoding: base64
Content-ID: <f_mmzj5pkq0>
X-Attachment-Id: f_mmzj5pkq0

JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgaHR0cDovL3d3
dy5yZXBvcnRsYWIuY29tCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIK
Pj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5B
bnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRv
YmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5z
aUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2Jq
CjQgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EtQm9sZE9ibGlxdWUgL0VuY29kaW5nIC9X
aW5BbnNpRW5jb2RpbmcgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+Pgpl
bmRvYmoKNSAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2
IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9j
U2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAv
VHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9k
ZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoK
PDwKL0F1dGhvciAoXChhbm9ueW1vdXNcKSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MDMwNTAzMjI0
OSswMCcwMCcpIC9DcmVhdG9yIChcKHVuc3BlY2lmaWVkXCkpIC9LZXl3b3JkcyAoKSAvTW9kRGF0
ZSAoRDoyMDI2MDMwNTAzMjI0OSswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJy
YXJ5IC0gd3d3LnJlcG9ydGxhYi5jb20pIAogIC9TdWJqZWN0IChcKHVuc3BlY2lmaWVkXCkpIC9U
aXRsZSAoXChhbm9ueW1vdXNcKSkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago4IDAgb2JqCjw8
Ci9Db3VudCAxIC9LaWRzIFsgNSAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjkgMCBvYmoK
PDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTMxMQo+
PgpzdHJlYW0KR2F0PSo/I1NeYCY6TyNOUXEpSlFCJmVPSWRcZSNjaCpuJ1JLc11QYWppJkwiRmQ6
VF4tYE5GMW9samxaJERnQko2RCtJQkI5KDwuUjUiXlU1PUdPaykqZmouMDk2NmwibFUoYmdMcnI2
SmpGWVFvN2gnNT8tQDFNYjlQQVIzWDUrWiYsNSVnV0wpMCMjIUonXTtyIXQ8Nk9RR29HJWIkZDQ0
OCFjU24hLFcqW101QFNuR0NOLTtPJW1IQENJNEBIXDU+K2FmIjUwPVg1KTczKT9jazhZOGxnTEU2
XjVqWEQ6WFVTQlpKLDEoIkNHcVVYMEgjPDNpRk9fN0dLO3QnaWQrQUs4QkEtOixBQz1iY08xZkNR
cStUI01bK0xjQmhHJ1AxRzNvJ21wSmFmYVYrc2UiOTRBPlJVP0ZaKVc5amI6PUZKTitcTyc3K1xP
OUYhdGIrY0dqW15BV21gKWhqJzxPRU9BVlQ1SjxDKGFAdUFFTjdAaDFwb3ErXSlaTmNRSHA3SVcu
MkdoN1ZbVlpKVVguYDVtWmNEJWcxJ0dYN0UtVi1EbCkuMmk7R14ya2FKQzxLLCVZc0BlVlhfNVJq
SmojSjBhMkpBZGwoNG5PM0ZOVGk/LCI/X21kJT1ZTDBLPTNfTG0sM0JULEo8REJPJGUzRTJHcTd1
WmNJbSxeIzhuNyYnMEpZSjtQSkI3JyY4JE5fdFlXSz1WcV1MSEVAW2JeZGVhQkBMNVBMImxGJjBF
aVM9PSJCQlM4cDlXYT1xVitOIVgiNyZXZFUjZlNaYyw8P14oUFtuVTRKPUZxX0c1OG8vP0IoUjJa
WFVfOWR0ImhqX2pmIyJgVlFRMTo5dEQpLnVAa21adGs2MGtNZU1XSGltMGd1RShfam5dJ2lKRmgs
KipTT2ZCPCtZaGBNYU8pLTonN0JqXiU/L09XKl1yL1o+PmlYW1taYU1Jbl0sLjojS1AyYThSVi0/
W0tbMEhWVGpfdFElOD5jcVhUNiJCaG4lYTlmNjg7SXJSbi9fSl0wLk4oLCI6TydBL0hWJmdMVyhY
TTYlW2dOSTRccVA3U05WLmJgLyNGMTZAYiVNT1lFTVhJV0o+ZGgocmNdc2lWLydBLDptO2ZUUGNw
ImBbMyUiQFtcWS1PTGNLSi9gWzk7SkZtRUBFWEFIITNtYzdnaCZAY3NnOzhEXVU6NC1VL0c7W1Vr
TjkmLFxVZDhiK1xIKUBXPUpmbSk7Q0ZKJ1w3SilLQnIkQDdpai08VD5Sa1dvZV4lJlhbZVxJcUlj
KT1XYmVfKThAKSY1JmM5aylGVlcnQVlRU2BVNyFTJD00UDJQPCZPS0pObFNINk1zVHVLREZWamVr
b1g4TVVYZjstaSdGXVRZZS49LWgiZFhwMTVeQj1oIVg+PismZHFWMjgxRUw3cV5BUS44UTtGamon
X3I5LlojP1dnNkQ/NE1EYzwyN2xNKzQ4LWNHY0toZidjYjdeJEtLM0pPWFFGS0lDS3UtPyFwYDpA
ViEsMmFLY2o0TS9FSCtxOFFSR15tcSpCWERkRi84KzYnJGZSMG49Qz4yK2JAZG41PTAxMWskR1E6
TGZDWiNpc0omOlNfQjcnck5HUllAIT5zMGpUcTdZYSNmXz44OzwoNEJqRyEzSjdCMnFCcmR0LG9M
RDY2JWs9NzchU0hSQEpUXypMOHJUOk1GcUcqYEtLUjcoaTMub0I/OlxURFIrRFhKJ2tsJFovWWgj
JUQpJy8uP34+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTAKMDAwMDAwMDAwMCA2NTUzNSBmIAow
MDAwMDAwMDczIDAwMDAwIG4gCjAwMDAwMDAxMjQgMDAwMDAgbiAKMDAwMDAwMDIzMSAwMDAwMCBu
IAowMDAwMDAwMzQzIDAwMDAwIG4gCjAwMDAwMDA0NjIgMDAwMDAgbiAKMDAwMDAwMDY2NSAwMDAw
MCBuIAowMDAwMDAwNzMzIDAwMDAwIG4gCjAwMDAwMDEwMTYgMDAwMDAgbiAKMDAwMDAwMTA3NSAw
MDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzw2NjQwNWU1MTJkMTFjZGFkMWJlMjYwMjc3NDc0OTBk
Nz48NjY0MDVlNTEyZDExY2RhZDFiZTI2MDI3NzQ3NDkwZDc+XQolIFJlcG9ydExhYiBnZW5lcmF0
ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAoaHR0cDovL3d3dy5yZXBvcnRsYWIuY29tKQoKL0lu
Zm8gNyAwIFIKL1Jvb3QgNiAwIFIKL1NpemUgMTAKPj4Kc3RhcnR4cmVmCjI0NzcKJSVFT0YK
--00000000000062d058064d7d1c7c--
