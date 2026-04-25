Return-path: <msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com>
Envelope-to: contacto@cleandmlimpieza.com.ar
Delivery-date: Sun, 19 Apr 2026 23:47:53 -0300
Received: from [156.70.2.177] (helo=mta-70-2-177.eventbrite.com.sparkpostmail.com)
	by vps-5692584-x.dattaweb.com with esmtps   (TLS1.2) tls TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
	(Exim)
	 (envelope-from <msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com>)
	id 1wEefw-007zy6-JA
	for contacto@cleandmlimpieza.com.ar; Sun, 19 Apr 2026 23:47:53 -0300
X-MSFBL: 8OGn8tAUKjlvMMO4H3gEOKi1Ut8Eaq4WDzMP6+qcfbw=|eyJjdXN0b21lcl9pZCI
	6IjI3NDY4OSIsInN1YmFjY291bnRfaWQiOiI0IiwidGVuYW50X2lkIjoic3BjIiw
	ibWVzc2FnZV9pZCI6IjY5ZTFkMzkzZTU2OTMzNTI3YjI4IiwiciI6ImNvbnRhY3R
	vQGNsZWFuZG1saW1waWV6YS5jb20uYXIifQ==
DKIM-Signature: v=1; a=rsa-sha256; c=relaxed/relaxed;
	d=campaign.eventbrite.com; s=scph0420; t=1776653267;
	i=@campaign.eventbrite.com;
	bh=ibxPTCZ3jcKyoacUNQnqq8Rll1R2hLW1hWO8wmJ+kio=;
	h=To:Message-ID:Date:Content-Type:From:Subject:List-Unsubscribe:
	 List-Unsubscribe-Post:From:To:Cc:Subject;
	b=rMaRfPGDWS4DCNI5cjDIcfr+6TDdBV+CTDb6wDLAoWNZOsfSJvCeAqWuc7yScw6X+
	 /BkznhAU+Bq67yYqPqaBEZyzMWhEyqi06hIqpsIotmAGOMbUSR3d9VByUvwB7aEv9/
	 AXHB0yllMgzOYwTwsboamWVdarVtI4bgNE7VgxMc=
Received: from [10.90.36.8] ([10.90.36.8])
	by i-04f0a569592f386c8.mta1vrest.sd.prd.sparkpost (ecelerity 5.2.0.75575 r(msys-ecelerity:tags/5.2.0.17)) with REST
	id 82/BF-49407-3D395E96; Mon, 20 Apr 2026 02:47:47 +0000
To: contacto@cleandmlimpieza.com.ar
Message-ID: <82.BF.49407.3D395E96@i-04f0a569592f386c8.mta1vrest.sd.prd.sparkpost>
Date: Mon, 20 Apr 2026 02:47:44 +0000
Content-Type: multipart/alternative; boundary="_----jrONktnqr/YN/LLEUyo6uA===_64/6F-49407-0D395E96"
MIME-Version: 1.0
Reply-To: matevalleymv@gmail.com
From: "Paulo Conteo" <noreply@campaign.eventbrite.com>
X-EventbriteMailer: missive_service
x-campaignid: consumer-lifecycle:campaign:invite
X-MSYS-API: {"campaign_id": "consumer-lifecycle:campaign:invite", "metadata": {"campaign_type": "invite", "email_class": "campaign", "item_id": 55300730, "organization_id": 739817129863, "service": "missive"}, "options": {"open_tracking": true, "click_tracking": false, "transactional": false, "ip_pool": "campaign"}}
X-Eventbrite: missive_service:739817129863:55300730
X-VirtualServerGroup: mail17
List-Unsubscribe: <mailto:unsubscribe@unsub.spmta.com?subject=unsubscribe:QU8DXwDMXAlQia_eSbIrREj876TqkuQjv-w3fMHEghQ~|eyAicmNwdF90byI6ICJjb250YWN0b0BjbGVhbmRtbGltcGllemEuY29tLmFyIiwgInRlbmFudF9pZCI6ICJzcGMiLCAiY3VzdG9tZXJfaWQiOiAiMjc0Njg5IiwgIm1lc3NhZ2VfaWQiOiAiNjllMWQzOTNlNTY5MzM1MjdiMjgiLCAic3ViYWNjb3VudF9pZCI6ICI0IiB9>,<https://unsubscribe.spmta.com/u/dru2TqYeLkSAn9dnb7SXpg~~/AAQxARA~/-df6sIG-VP1OiPoj2oen_FHhZgqHWJmQQKzgh0SShlCLkof7Tn8ujjnGdPP8scxNSbzq-sw5bz1MgVaEMcKMXA~~>
List-Unsubscribe-Post: List-Unsubscribe=One-Click
List-Id: <spc.274689.4.sparkpostmail.com>
X-VirusChecked: Checked
Precedence: bulk
X-Spam-Score: 8.1
X-Spam-Score-Int: 80
X-Spam-Bar: ++++++++
X-Spam-Report: Action: no action
 Symbol: ARC_NA(0.00)
 Symbol: FROM_HAS_DN(0.00)
 Symbol: FROM_NEQ_ENVFROM(0.32)
 Symbol: MANY_INVISIBLE_PARTS(0.89)
 Symbol: RCVD_COUNT_TWO(0.00)
 Symbol: TO_DN_NONE(0.00)
 Symbol: HAS_LIST_UNSUB(-0.50)
 Symbol: SUBJECT_ENDS_SPACES(0.50)
 Symbol: URIBL_HOSTKARMA_OLDER_10D(0.10)
 Symbol: MIME_GOOD(-0.10)
 Symbol: RWL_MAILSPIKE_POSSIBLE(0.00)
 Symbol: REDIRECTOR_URL(0.00)
 Symbol: R_SPF_ALLOW(0.00)
 Symbol: ASN(0.00)
 Symbol: MISSING_XM_UA(0.77)
 Symbol: RM_HEADER_00(0.00)
 Symbol: AUTHENTICATED_LOCAL_USER(-1.00)
 Symbol: REPLYTO_DOM_NEQ_TO_DOM(0.51)
 Symbol: DKIM_TRACE(0.00)
 Symbol: REPLYTO_DOM_NEQ_FROM_DOM(0.00)
 Symbol: SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00)
 Symbol: DMARC_POLICY_ALLOW(0.00)
 Symbol: BAYES_HAM(-0.99)
 Symbol: TO_MATCH_ENVRCPT_ALL(0.00)
 Symbol: RCVD_TLS_LAST(0.00)
 Symbol: BAD_REP_POLICIES(1.00)
 Symbol: R_DKIM_ALLOW(0.00)
 Symbol: FREEMAIL_REPLYTO_NEQ_FROM(2.00)
 Symbol: MX_GOOD(0.00)
 Symbol: URIBL_HOSTKARMA_NOBLACK(-0.32)
 Symbol: ZERO_FONT(0.30)
 Symbol: URI_COUNT_ODD(1.00)
 Symbol: FUZZY_RATELIMITED(0.00)
 Symbol: FORGED_SENDER(0.30)
 Symbol: RCPT_COUNT_ONE(0.00)
 Symbol: URIBL_HOSTKARMA_BROWN(0.80)
 Symbol: MIME_TRACE(0.00)
 Symbol: FREEMAIL_REPLYTO(0.00)
 Symbol: HAS_LIST_UNSUB_HEADER(-0.50)
 Symbol: HAS_REPLYTO(0.00)
 X-Symbol: ARC_NA(0.00); ARC signature absent
 X-Symbol: FROM_HAS_DN(0.00); From header has a display name
 X-Symbol: FROM_NEQ_ENVFROM(0.32); From address is different to the envelope [noreply@campaign.eventbrite.com, msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com]
 X-Symbol: MANY_INVISIBLE_PARTS(0.89); Many parts are visually hidden [4]
 X-Symbol: RCVD_COUNT_TWO(0.00); Message has two Received headers [2]
 X-Symbol: TO_DN_NONE(0.00); None of the recipients have display names
 X-Symbol: HAS_LIST_UNSUB(-0.50); Has List-Unsubscribe header
 X-Symbol: SUBJECT_ENDS_SPACES(0.50); Subject ends with space characters
 X-Symbol: URIBL_HOSTKARMA_OLDER_10D(0.10); Spam listado hace mas de 10 dias [eventbrite.com.ar:url]
 X-Symbol: MIME_GOOD(-0.10); Known content-type [multipart/alternative, text/plain]
 X-Symbol: RWL_MAILSPIKE_POSSIBLE(0.00); From address is listed in Mailspike RWL - possibly legit [156.70.2.177:from]
 X-Symbol: REDIRECTOR_URL(0.00); The presence of a redirector in the mail [twitter.com]
 X-Symbol: R_SPF_ALLOW(0.00); SPF verification allows sending [+exists:156.70.2.177._spf.sparkpostmail.com]
 X-Symbol: ASN(0.00) [asn:23528, ipnet:156.70.2.0/23, country:US]
 X-Symbol: MISSING_XM_UA(0.77); Message has neither X-Mailer nor User-Agent header
 X-Symbol: RM_HEADER_00(0.00); -HAS_LIST_UNSUB_HEADER & (^MSGID_IS_MKT|^PRECEDENCE_BULK|^BODY_MKT_SIGN)
 X-Symbol: AUTHENTICATED_LOCAL_USER(-1.00); Mail Autenticado [vps-5692584-x.dattaweb.com]
 X-Symbol: REPLYTO_DOM_NEQ_TO_DOM(0.51); Reply-To domain does not match the To domain
 X-Symbol: DKIM_TRACE(0.00); DKIM trace symbol [campaign.eventbrite.com:+]
 X-Symbol: REPLYTO_DOM_NEQ_FROM_DOM(0.00); Reply-To domain does not match the From domain
 X-Symbol: SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00); Message contains redirector, anonymous or IPFS gateway URL and is marked by fuzzy/bayes/SURBL/RBL
 X-Symbol: DMARC_POLICY_ALLOW(0.00); DMARC permit policy [eventbrite.com, quarantine]
 X-Symbol: BAYES_HAM(-0.99); Message probably ham, probability:  [99.99%]
 X-Symbol: TO_MATCH_ENVRCPT_ALL(0.00); All of the recipients match the envelope
 X-Symbol: RCVD_TLS_LAST(0.00); Last hop used encrypted transports
 X-Symbol: BAD_REP_POLICIES(1.00); Contains valid policies but are also marked by fuzzy/bayes/SURBL/RBL
 X-Symbol: R_DKIM_ALLOW(0.00); DKIM verification succeed [campaign.eventbrite.com:s=scph0420]
 X-Symbol: FREEMAIL_REPLYTO_NEQ_FROM(2.00); Reply-To is a Freemail address and it not match From header or SMTP From, also From is not another Freemail
 X-Symbol: MX_GOOD(0.00); MX was ok [cached: smtp.sparkpostmail.com]
 X-Symbol: URIBL_HOSTKARMA_NOBLACK(-0.32); spam sin verificar aun [eventbrite.com:url]
 X-Symbol: ZERO_FONT(0.30); Uso de fuentes de tamaño cero para ocultar texto [2]
 X-Symbol: URI_COUNT_ODD(1.00); Odd number of URIs in multipart/alternative message [9]
 X-Symbol: FUZZY_RATELIMITED(0.00); Fuzzy rate limit is reached [rspamd.com]
 X-Symbol: FORGED_SENDER(0.30); Sender is forged (different From: header and smtp MAIL FROM: addresses) [noreply@campaign.eventbrite.com, msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com]
 X-Symbol: RCPT_COUNT_ONE(0.00); One recipient [1]
 X-Symbol: URIBL_HOSTKARMA_BROWN(0.80); Es spam pero no lo suficiente para ir a lista negra [mta-70-2-177.eventbrite.com.sparkpostmail.com:helo, instagram.com:url]
 X-Symbol: MIME_TRACE(0.00) [0:+, 1:+, 2:~]
 X-Symbol: FREEMAIL_REPLYTO(0.00); Reply-To is a Freemail address [gmail.com]
 X-Symbol: HAS_LIST_UNSUB_HEADER(-0.50); multimap, type header: HAS_LIST_UNSUB_HEADER [<mailto:unsubscribe@unsub.spmta.com?subject=unsubscribe:QU8DXwDMXAlQia_eSbIrREj876TqkuQjv-w3fMHEghQ~|eyAicmNwdF90byI6ICJjb250YWN0b0BjbGVhbmRtbGltcGllemEuY29tLmFyIiwgInRlbmFudF9pZCI6ICJzcGMiLCAiY3VzdG9tZXJfaWQiOiAiMjc0Njg5IiwgIm1lc3NhZ2VfaWQiOiAiNjllMWQzOTNlNTY5MzM1MjdiMjgiLCAic3ViYWNjb3VudF9pZCI6ICI0IiB9>,<https://unsubscribe.spmta.com/u/dru2TqYeLkSAn9dnb7SXpg~~/AAQxARA~/-df6sIG-VP1OiPoj2oen_FHhZgqHWJmQQKzgh0SShlCLkof7Tn8ujjnGdPP8scxNSbzq-sw5bz1MgVaEMcKMXA~~>]
 X-Symbol: HAS_REPLYTO(0.00); Has Reply-To header [matevalleymv@gmail.com]
 Message-ID: 82.BF.49407.3D395E96@i-04f0a569592f386c8.mta1vrest.sd.prd.sparkpost
 X-Milter-Add: X-Rspamd-Queue-Id: 1wEefw-007zy6-JA
 X-Milter-Add: X-Rspamd-Server: eternia6
 X-Milter-Add: X-Spamd-Result: default: False [8.08 / 50.00];
 	SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00)[];
 	FREEMAIL_REPLYTO_NEQ_FROM(2.00)[];
 	AUTHENTICATED_LOCAL_USER(-1.00)[vps-5692584-x.dattaweb.com];
 	URI_COUNT_ODD(1.00)[9];
 	BAD_REP_POLICIES(1.00)[];
 	BAYES_HAM(-1.00)[99.99%];
 	MANY_INVISIBLE_PARTS(0.90)[4];
 	URIBL_HOSTKARMA_BROWN(0.80)[mta-70-2-177.eventbrite.com.sparkpostmail.com:helo,instagram.com:url];
 	MISSING_XM_UA(0.77)[];
 	REPLYTO_DOM_NEQ_TO_DOM(0.51)[];
 	HAS_LIST_UNSUB_HEADER(-0.50)[<mailto:unsubscribe@unsub.spmta.com?subject=unsubscribe:QU8DXwDMXAlQia_eSbIrREj876TqkuQjv-w3fMHEghQ~|eyAicmNwdF90byI6ICJjb250YWN0b0BjbGVhbmRtbGltcGllemEuY29tLmFyIiwgInRlbmFudF9pZCI6ICJzcGMiLCAiY3VzdG9tZXJfaWQiOiAiMjc0Njg5IiwgIm1lc3NhZ2VfaWQiOiAiNjllMWQzOTNlNTY5MzM1MjdiMjgiLCAic3ViYWNjb3VudF9pZCI6ICI0IiB9>,<https://unsubscribe.spmta.com/u/dru2TqYeLkSAn9dnb7SXpg~~/AAQxARA~/-df6sIG-VP1OiPoj2oen_FHhZgqHWJmQQKzgh0SShlCLkof7Tn8ujjnGdPP8scxNSbzq-sw5bz1MgVaEMcKMXA~~>];
 	HAS_LIST_UNSUB(-0.50)[];
 	SUBJECT_ENDS_SPACES(0.50)[];
 	FROM_NEQ_ENVFROM(0.32)[noreply@campaign.eventbrite.com,msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com];
 	URIBL_HOSTKARMA_NOBLACK(-0.32)[eventbrite.com:url];
 	ZERO_FONT(0.30)[2];
 	FORGED_SENDER(0.30)[noreply@campaign.eventbrite.com,msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com];
 	URIBL_HOSTKARMA_OLDER_10D(0.10)[eventbrite.com.ar:url];
 	MIME_GOOD(-0.10)[multipart/alternative,text/plain];
 	MX_GOOD(0.00)[cached: smtp.sparkpostmail.com];
 	FUZZY_RATELIMITED(0.00)[rspamd.com];
 	RCPT_COUNT_ONE(0.00)[1];
 	R_DKIM_ALLOW(0.00)[campaign.eventbrite.com:s=scph0420];
 	FREEMAIL_REPLYTO(0.00)[gmail.com];
 	MIME_TRACE(0.00)[0:+,1:+,2:~];
 	ARC_NA(0.00)[];
 	REPLYTO_DOM_NEQ_FROM_DOM(0.00)[];
 	TO_MATCH_ENVRCPT_ALL(0.00)[];
 	TO_DN_NONE(0.00)[];
 	RWL_MAILSPIKE_POSSIBLE(0.00)[156.70.2.177:from];
 	RCVD_COUNT_TWO(0.00)[2];
 	FROM_HAS_DN(0.00)[];
 	RCVD_TLS_LAST(0.00)[];
 	REDIRECTOR_URL(0.00)[twitter.com];
 	ASN(0.00)[asn:23528, ipnet:156.70.2.0/23, country:US];
 	DMARC_POLICY_ALLOW(0.00)[eventbrite.com,quarantine];
 	R_SPF_ALLOW(0.00)[+exists:156.70.2.177._spf.sparkpostmail.com];
 	DKIM_TRACE(0.00)[campaign.eventbrite.com:+];
 	RM_HEADER_00(0.00)[];
 	HAS_REPLYTO(0.00)[matevalleymv@gmail.com]
 X-Milter-Add: X-Rspamd-Action: no action
 X-Milter-Del: X-Rspamd-Action
 X-Milter-Del: X-Rspamd-Server
 X-Milter-Del: X-Spamd-Result
 X-Milter-Del: X-Spam
 X-Milter-Del: X-Rspamd-Queue-Id
X-Spam-Flag: Yes
X-Spam-Status: Yes
X-Spam-Threshold: 70
X-Rejected-By: Action: no action
 Symbol: ARC_NA(0.00)
 Symbol: FROM_HAS_DN(0.00)
 Symbol: FROM_NEQ_ENVFROM(0.32)
 Symbol: MANY_INVISIBLE_PARTS(0.89)
 Symbol: RCVD_COUNT_TWO(0.00)
 Symbol: TO_DN_NONE(0.00)
 Symbol: HAS_LIST_UNSUB(-0.50)
 Symbol: SUBJECT_ENDS_SPACES(0.50)
 Symbol: URIBL_HOSTKARMA_OLDER_10D(0.10)
 Symbol: MIME_GOOD(-0.10)
 Symbol: RWL_MAILSPIKE_POSSIBLE(0.00)
 Symbol: REDIRECTOR_URL(0.00)
 Symbol: R_SPF_ALLOW(0.00)
 Symbol: ASN(0.00)
 Symbol: MISSING_XM_UA(0.77)
 Symbol: RM_HEADER_00(0.00)
 Symbol: AUTHENTICATED_LOCAL_USER(-1.00)
 Symbol: REPLYTO_DOM_NEQ_TO_DOM(0.51)
 Symbol: DKIM_TRACE(0.00)
 Symbol: REPLYTO_DOM_NEQ_FROM_DOM(0.00)
 Symbol: SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00)
 Symbol: DMARC_POLICY_ALLOW(0.00)
 Symbol: BAYES_HAM(-0.99)
 Symbol: TO_MATCH_ENVRCPT_ALL(0.00)
 Symbol: RCVD_TLS_LAST(0.00)
 Symbol: BAD_REP_POLICIES(1.00)
 Symbol: R_DKIM_ALLOW(0.00)
 Symbol: FREEMAIL_REPLYTO_NEQ_FROM(2.00)
 Symbol: MX_GOOD(0.00)
 Symbol: URIBL_HOSTKARMA_NOBLACK(-0.32)
 Symbol: ZERO_FONT(0.30)
 Symbol: URI_COUNT_ODD(1.00)
 Symbol: FUZZY_RATELIMITED(0.00)
 Symbol: FORGED_SENDER(0.30)
 Symbol: RCPT_COUNT_ONE(0.00)
 Symbol: URIBL_HOSTKARMA_BROWN(0.80)
 Symbol: MIME_TRACE(0.00)
 Symbol: FREEMAIL_REPLYTO(0.00)
 Symbol: HAS_LIST_UNSUB_HEADER(-0.50)
 Symbol: HAS_REPLYTO(0.00)
 X-Symbol: ARC_NA(0.00); ARC signature absent
 X-Symbol: FROM_HAS_DN(0.00); From header has a display name
 X-Symbol: FROM_NEQ_ENVFROM(0.32); From address is different to the envelope [noreply@campaign.eventbrite.com, msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com]
 X-Symbol: MANY_INVISIBLE_PARTS(0.89); Many parts are visually hidden [4]
 X-Symbol: RCVD_COUNT_TWO(0.00); Message has two Received headers [2]
 X-Symbol: TO_DN_NONE(0.00); None of the recipients have display names
 X-Symbol: HAS_LIST_UNSUB(-0.50); Has List-Unsubscribe header
 X-Symbol: SUBJECT_ENDS_SPACES(0.50); Subject ends with space characters
 X-Symbol: URIBL_HOSTKARMA_OLDER_10D(0.10); Spam listado hace mas de 10 dias [eventbrite.com.ar:url]
 X-Symbol: MIME_GOOD(-0.10); Known content-type [multipart/alternative, text/plain]
 X-Symbol: RWL_MAILSPIKE_POSSIBLE(0.00); From address is listed in Mailspike RWL - possibly legit [156.70.2.177:from]
 X-Symbol: REDIRECTOR_URL(0.00); The presence of a redirector in the mail [twitter.com]
 X-Symbol: R_SPF_ALLOW(0.00); SPF verification allows sending [+exists:156.70.2.177._spf.sparkpostmail.com]
 X-Symbol: ASN(0.00) [asn:23528, ipnet:156.70.2.0/23, country:US]
 X-Symbol: MISSING_XM_UA(0.77); Message has neither X-Mailer nor User-Agent header
 X-Symbol: RM_HEADER_00(0.00); -HAS_LIST_UNSUB_HEADER & (^MSGID_IS_MKT|^PRECEDENCE_BULK|^BODY_MKT_SIGN)
 X-Symbol: AUTHENTICATED_LOCAL_USER(-1.00); Mail Autenticado [vps-5692584-x.dattaweb.com]
 X-Symbol: REPLYTO_DOM_NEQ_TO_DOM(0.51); Reply-To domain does not match the To domain
 X-Symbol: DKIM_TRACE(0.00); DKIM trace symbol [campaign.eventbrite.com:+]
 X-Symbol: REPLYTO_DOM_NEQ_FROM_DOM(0.00); Reply-To domain does not match the From domain
 X-Symbol: SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00); Message contains redirector, anonymous or IPFS gateway URL and is marked by fuzzy/bayes/SURBL/RBL
 X-Symbol: DMARC_POLICY_ALLOW(0.00); DMARC permit policy [eventbrite.com, quarantine]
 X-Symbol: BAYES_HAM(-0.99); Message probably ham, probability:  [99.99%]
 X-Symbol: TO_MATCH_ENVRCPT_ALL(0.00); All of the recipients match the envelope
 X-Symbol: RCVD_TLS_LAST(0.00); Last hop used encrypted transports
 X-Symbol: BAD_REP_POLICIES(1.00); Contains valid policies but are also marked by fuzzy/bayes/SURBL/RBL
 X-Symbol: R_DKIM_ALLOW(0.00); DKIM verification succeed [campaign.eventbrite.com:s=scph0420]
 X-Symbol: FREEMAIL_REPLYTO_NEQ_FROM(2.00); Reply-To is a Freemail address and it not match From header or SMTP From, also From is not another Freemail
 X-Symbol: MX_GOOD(0.00); MX was ok [cached: smtp.sparkpostmail.com]
 X-Symbol: URIBL_HOSTKARMA_NOBLACK(-0.32); spam sin verificar aun [eventbrite.com:url]
 X-Symbol: ZERO_FONT(0.30); Uso de fuentes de tamaño cero para ocultar texto [2]
 X-Symbol: URI_COUNT_ODD(1.00); Odd number of URIs in multipart/alternative message [9]
 X-Symbol: FUZZY_RATELIMITED(0.00); Fuzzy rate limit is reached [rspamd.com]
 X-Symbol: FORGED_SENDER(0.30); Sender is forged (different From: header and smtp MAIL FROM: addresses) [noreply@campaign.eventbrite.com, msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com]
 X-Symbol: RCPT_COUNT_ONE(0.00); One recipient [1]
 X-Symbol: URIBL_HOSTKARMA_BROWN(0.80); Es spam pero no lo suficiente para ir a lista negra [mta-70-2-177.eventbrite.com.sparkpostmail.com:helo, instagram.com:url]
 X-Symbol: MIME_TRACE(0.00) [0:+, 1:+, 2:~]
 X-Symbol: FREEMAIL_REPLYTO(0.00); Reply-To is a Freemail address [gmail.com]
 X-Symbol: HAS_LIST_UNSUB_HEADER(-0.50); multimap, type header: HAS_LIST_UNSUB_HEADER [<mailto:unsubscribe@unsub.spmta.com?subject=unsubscribe:QU8DXwDMXAlQia_eSbIrREj876TqkuQjv-w3fMHEghQ~|eyAicmNwdF90byI6ICJjb250YWN0b0BjbGVhbmRtbGltcGllemEuY29tLmFyIiwgInRlbmFudF9pZCI6ICJzcGMiLCAiY3VzdG9tZXJfaWQiOiAiMjc0Njg5IiwgIm1lc3NhZ2VfaWQiOiAiNjllMWQzOTNlNTY5MzM1MjdiMjgiLCAic3ViYWNjb3VudF9pZCI6ICI0IiB9>,<https://unsubscribe.spmta.com/u/dru2TqYeLkSAn9dnb7SXpg~~/AAQxARA~/-df6sIG-VP1OiPoj2oen_FHhZgqHWJmQQKzgh0SShlCLkof7Tn8ujjnGdPP8scxNSbzq-sw5bz1MgVaEMcKMXA~~>]
 X-Symbol: HAS_REPLYTO(0.00); Has Reply-To header [matevalleymv@gmail.com]
 Message-ID: 82.BF.49407.3D395E96@i-04f0a569592f386c8.mta1vrest.sd.prd.sparkpost
 X-Milter-Add: X-Rspamd-Queue-Id: 1wEefw-007zy6-JA
 X-Milter-Add: X-Rspamd-Server: eternia6
 X-Milter-Add: X-Spamd-Result: default: False [8.08 / 50.00];
 	SUSPICIOUS_URL_IN_SUSPICIOUS_MESSAGE(3.00)[];
 	FREEMAIL_REPLYTO_NEQ_FROM(2.00)[];
 	AUTHENTICATED_LOCAL_USER(-1.00)[vps-5692584-x.dattaweb.com];
 	URI_COUNT_ODD(1.00)[9];
 	BAD_REP_POLICIES(1.00)[];
 	BAYES_HAM(-1.00)[99.99%];
 	MANY_INVISIBLE_PARTS(0.90)[4];
 	URIBL_HOSTKARMA_BROWN(0.80)[mta-70-2-177.eventbrite.com.sparkpostmail.com:helo,instagram.com:url];
 	MISSING_XM_UA(0.77)[];
 	REPLYTO_DOM_NEQ_TO_DOM(0.51)[];
 	HAS_LIST_UNSUB_HEADER(-0.50)[<mailto:unsubscribe@unsub.spmta.com?subject=unsubscribe:QU8DXwDMXAlQia_eSbIrREj876TqkuQjv-w3fMHEghQ~|eyAicmNwdF90byI6ICJjb250YWN0b0BjbGVhbmRtbGltcGllemEuY29tLmFyIiwgInRlbmFudF9pZCI6ICJzcGMiLCAiY3VzdG9tZXJfaWQiOiAiMjc0Njg5IiwgIm1lc3NhZ2VfaWQiOiAiNjllMWQzOTNlNTY5MzM1MjdiMjgiLCAic3ViYWNjb3VudF9pZCI6ICI0IiB9>,<https://unsubscribe.spmta.com/u/dru2TqYeLkSAn9dnb7SXpg~~/AAQxARA~/-df6sIG-VP1OiPoj2oen_FHhZgqHWJmQQKzgh0SShlCLkof7Tn8ujjnGdPP8scxNSbzq-sw5bz1MgVaEMcKMXA~~>];
 	HAS_LIST_UNSUB(-0.50)[];
 	SUBJECT_ENDS_SPACES(0.50)[];
 	FROM_NEQ_ENVFROM(0.32)[noreply@campaign.eventbrite.com,msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com];
 	URIBL_HOSTKARMA_NOBLACK(-0.32)[eventbrite.com:url];
 	ZERO_FONT(0.30)[2];
 	FORGED_SENDER(0.30)[noreply@campaign.eventbrite.com,msprvs1=20570G1NGbo_G=bounces-274689-4@bounce.eventbrite.com];
 	URIBL_HOSTKARMA_OLDER_10D(0.10)[eventbrite.com.ar:url];
 	MIME_GOOD(-0.10)[multipart/alternative,text/plain];
 	MX_GOOD(0.00)[cached: smtp.sparkpostmail.com];
 	FUZZY_RATELIMITED(0.00)[rspamd.com];
 	RCPT_COUNT_ONE(0.00)[1];
 	R_DKIM_ALLOW(0.00)[campaign.eventbrite.com:s=scph0420];
 	FREEMAIL_REPLYTO(0.00)[gmail.com];
 	MIME_TRACE(0.00)[0:+,1:+,2:~];
 	ARC_NA(0.00)[];
 	REPLYTO_DOM_NEQ_FROM_DOM(0.00)[];
 	TO_MATCH_ENVRCPT_ALL(0.00)[];
 	TO_DN_NONE(0.00)[];
 	RWL_MAILSPIKE_POSSIBLE(0.00)[156.70.2.177:from];
 	RCVD_COUNT_TWO(0.00)[2];
 	FROM_HAS_DN(0.00)[];
 	RCVD_TLS_LAST(0.00)[];
 	REDIRECTOR_URL(0.00)[twitter.com];
 	ASN(0.00)[asn:23528, ipnet:156.70.2.0/23, country:US];
 	DMARC_POLICY_ALLOW(0.00)[eventbrite.com,quarantine];
 	R_SPF_ALLOW(0.00)[+exists:156.70.2.177._spf.sparkpostmail.com];
 	DKIM_TRACE(0.00)[campaign.eventbrite.com:+];
 	RM_HEADER_00(0.00)[];
 	HAS_REPLYTO(0.00)[matevalleymv@gmail.com]
 X-Milter-Add: X-Rspamd-Action: no action
 X-Milter-Del: X-Rspamd-Action
 X-Milter-Del: X-Rspamd-Server
 X-Milter-Del: X-Spamd-Result
 X-Milter-Del: X-Spam
 X-Milter-Del: X-Rspamd-Queue-Id
X-ME-Content: Deliver-To=Junk
X-Spam-Threshold: 70
X-Spam-Status: Yes
Subject: ****SPAM**** Mesa de Negocios - Networking Empresarial

--_----jrONktnqr/YN/LLEUyo6uA===_64/6F-49407-0D395E96
Content-Transfer-Encoding: quoted-printable
Content-Type: text/plain; charset="UTF-8"

Reuni=C3=B3n de Networking EmpresarialLa Mesa de Negocios es un encuentro e=
xclusivo dise=C3=B1ado para reunir empresarios del sector de servicios en u=
na ma=C3=B1ana de networking profesional, con foco en generar conexiones es=
trat=C3=A9gicas y oportunidades reales de negocio.=0A=0A=0A=0AFeatured Even=
ts:=0A=0AMesa de Negocios - Networking Empresarial | Palermo Hollywood | 20=
26-04-30T12:00:00Z=0Ahttps://www.eventbrite.com=0A=0A=0A=0A=0A=0A=0AUnsubsc=
ribe: https://www.eventbrite.com.ar/organizations/missive/activity/unsubscr=
ibe/=3Fp=3DABIdvVs3Vy7J7r1W-yVTapDh4rMRgmR8hf5rhhyDGaWkbitb3_a0VV2F-Zu_-qIi=
aoiZHig00-v2p7zoZ93y_S86D9F1a8qKNZx10n_7O2Ut2kzR03K2J_K34pVvFGtRTj-9Bv3haMd=
EXv6BXXZ3IZIUvHGqs-7s0QkXmwGgUh4ZnNlxZs33AHp-SgvyqhQOEYNfXfyb1t9eoeRa8yz3Eh=
LoVbe3o6URpqey7HRxI2wKFc8V-l4cJIRTvF24c_nqbsQWZs51nX8kYgffbbO_mqyFHgXF7qVsR=
A&c=3D55300730&co=3D4564581911
--_----jrONktnqr/YN/LLEUyo6uA===_64/6F-49407-0D395E96
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.=
w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns=3D"http://www.w3.=
org/1999/xhtml" xmlns:v=3D"urn:schemas-microsoft-com:vml" xmlns:o=3D"urn:sc=
hemas-microsoft-com:office:office"><head><title></title> <!--[if !mso]><!--=
 --><meta http-equiv=3D"X-UA-Compatible" content=3D"IE=3Dedge"> <!--<![endi=
f]--><meta http-equiv=3D"Content-Type" content=3D"text/html; charset=3DUTF-=
8"><meta name=3D"viewport" content=3D"width=3Ddevice-width, initial-scale=
=3D1"><style type=3D"text/css">/*<![CDATA[*/#outlook a{padding:0}.ReadMsgBo=
dy{width:100%}.ExternalClass{width:100%}.ExternalClass, .ExternalClass p, .=
ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass =
div{line-height:100%}body,table,td,p,a,li,blockquote{-webkit-text-size-adju=
st:100%;-ms-text-size-adjust:100%}table,td{mso-table-lspace:0pt;mso-table-r=
space:0pt}img{-ms-interpolation-mode:bicubic}body{margin:0;padding:0}img{bo=
rder:0;height:auto;line-height:100%;outline:none;text-decoration:none}table=
,td{border-collapse:collapse !important}body,#bodyTable,#bodyCell{height:10=
0% !important;margin:0;padding:0;width:100% !important}p{display:block}body=
,#bodyTable,#bodyCell{font-family:'Neue Plak',-apple-system,BlinkMacSystemF=
ont,Roboto,'Helvetica Neue',Helvetica,Tahoma,Arial,sans-serif}#templateCont=
ainer{width:90%}#bodyCell{padding:56px 0}#templateContainer{border-radius:2=
px;background-color:#FFFFFF}#templateBody{background-color:#FFFFFF;border-r=
adius:2px}#templateBodyContent{padding:0}#bodyContent{padding:0}.bodyConten=
t{color:#444444;font-size:15px;line-height:1.4}.bodyContent a:link, .bodyCo=
ntent a:visited, .bodyContent a .yshortcuts{color:#3659e3;font-weight:norma=
l;text-decoration:none}.bodyContent img{display:inline;max-width:560px}.img=
-hide-download-icon img+div{display:none}#body-message a, #body-message a:v=
isited, #body-message a:enabled{color:#3659e3!important}#body-message ol, #=
body-message ul{list-style-position:inside}#organizer_address a, #organizer=
_address a:visited, #organizer_address a:enabled{text-decoration:none !impo=
rtant;color:#444444!important}h1{font-size:35px;letter-spacing:0.36px;line-=
height:47px;text-align:center}.events--default-row{display:flex}@media only=
 screen and (max-width: 600px){body,table,td,p,a,li,blockquote{-webkit-text=
-size-adjust:none !important}body{width:100% !important;min-width:100% !imp=
ortant}#bodyCell{padding:0 !important}#templateBodyContent{padding:0 !impor=
tant}#templateContainer{max-width:600px !important;width:100% !important}h1=
{font-size:24px !important;line-height:100% !important}h2{font-size:20px !i=
mportant;line-height:100% !important}h3{font-size:18px !important;line-heig=
ht:100% !important}h4{font-size:16px !important;line-height:100% !important=
}.bodyContent{font-size:18px !important;line-height:125% !important}.event-=
-default-wrapper{width:560px}.events--default-column{display:flex;width:100=
%}.events--default-row{display:block}.featured-events-mobile{text-align:lef=
t !important;margin:0 !important}.rsvp-button-featured{display:table-cell;t=
ext-align:end;float:right}.event-name-featured{display:table-cell;padding-r=
ight:0.5em}}@media only screen and (min-width: 792px){.events--default-colu=
mn{display:flex;width:100%;max-width:260px}}@media only screen and (min-wid=
th: 601px){.body{padding:20px 0}#bodyContent{background-color:#FFF;}.event-=
-default-wrapper{max-width:50%}.events--default-column{width:100%}.events--=
default-column.event--left{margin-right:20px}.events--default-column.event-=
-right{margin-left:20px}.featured-events-mobile{text-align:left !important;=
margin:0 !important}.rsvp-button-featured{display:table-cell;float:right}.e=
vent-name-featured{display:table-cell;padding-right:0.5em}}@media only scre=
en and (min-width:481px){.mj-column-per-100{width:100% !important}.mj-colum=
n-per-33{width:33% !important}.mj-column-per-62{width:62% !important}.mj-co=
lumn-per-30{width:30% !important}.mj-column-px-30{width:30px !important}.mj=
-column-per-43{width:43% !important}.mj-column-per-57{width:57% !important;=
margin-top:0 !important}.featured-events-mobile{text-align:left !important;=
margin:0 !important}.name-button-featured{width:100%;display:inline-table}.=
event-name-featured{float:left;width:70%;padding-right:0.5em}}@media all an=
d (min-width:0px) and (max-width:480px){.mj-image-px-164{width:auto !import=
ant;height:auto !important}.featured-events-mobile{text-align:center !impor=
tant;margin:0 auto !important}.featured-events-image{padding:0 !important;w=
idth:100% !important}.name-button-featured{display:inline-block;text-align:=
start}.rsvp-button-featured{margin-bottom:12px;margin-top:12px;display:bloc=
k;float:left}}/*]]>*/</style> <!--[if mso]><style type=3D"text/css">@media =
only screen and (max-width:480px){@-ms-viewport{width:320px}@viewport{width=
:320px}}</style><![endif]--> <!--[if gte mso 9]><xml> <o:OfficeDocumentSett=
ings> <o:AllowPNG/> <o:PixelsPerInch>96</o:PixelsPerInch> </o:OfficeDocumen=
tSettings> </xml><![endif]--><!--[if lte mso 11]><style type=3D"text/css">.=
outlook-group-fix{width:100% !important}</style><![endif]--></head><body le=
ftmargin=3D"0" marginwidth=3D"0" topmargin=3D"0" marginheight=3D"0" offset=
=3D"0" style=3D"background-color: #FFFFFF;">=0D=0A<div style=3D"color:trans=
parent;visibility:hidden;opacity:0;font-size:0px;border:0;max-height:1px;wi=
dth:1px;margin:0px;padding:0px;border-width:0px!important;display:none!impo=
rtant;line-height:0px!important;"><img border=3D"0" width=3D"1" height=3D"1=
" src=3D"https://clicks.eventbrite.com/q/u8SUcq781vwi-EREQCGZNQ~~/AAQxARA~/=
c4vZrhoFxcUtN6y7cd0kYUeAmkOl4kW14VYsYk0MQE6Mu0mujTpGVrzEf6cNLL9KkannL576Wqt=
zsvKVYklOgg~~" alt=3D""/></div>=0D=0A<div style=3D"display: none; max-heigh=
t: 0px; overflow: hidden;"> Reuni=C3=B3n de Networking EmpresarialLa Mesa d=
e Negocios es un encuentro exclusivo dise=C3=B1ado para reunir empresarios =
del sector de servicios en una ma=C3=B1ana de networking profesional, con f=
oco en generar conexiones estrat=C3=A9gicas y oportunidades reales de negoc=
io.</div><div style=3D"display: none; max-height: 0px; overflow: hidden;"> =
&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nb=
sp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;=
&zwnj;&nbsp;</div><center><table align=3D"center" border=3D"0" cellpadding=
=3D"0" cellspacing=3D"0" height=3D"100%" width=3D"100%" id=3D"bodyTable" st=
yle=3D"font-family:'Neue Plak',-apple-system,BlinkMacSystemFont,Roboto,'Hel=
vetica Neue',Helvetica,Tahoma,Arial,sans-serif;"><tr><td align=3D"center" v=
align=3D"top" id=3D"bodyCell" style=3D"width:560px;"><table border=3D"0" ce=
llpadding=3D"0" cellspacing=3D"0" id=3D"templateContainer" width=3D"100%" s=
tyle=3D"background-color:#FFFFFF;max-width:800px;"> <tr><td align=3D"center=
" valign=3D"top" style=3D"width:560px;"><table class=3D"img-hide-download-i=
con" border=3D"0" role=3D"presentation" style=3D"width:100%;" cellpadding=
=3D"0" cellspacing=3D"0" align=3D"center" width=3D"100%" id=3D"templateHead=
er"><tr><td align=3D"center" bgcolor=3D"#FFFFFF" style=3D"width:560px;">  <=
a href=3D"https://www.eventbrite.com.ar/o/mate-valley-39096945183">  <img s=
rc=3D"https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F11821936=
82%2F739815347473%2F1%2Foriginal.20260415-013412=3Fw=3D1200&amp;auto=3Dform=
at%2Ccompress&amp;q=3D75&amp;sharp=3D10&amp;s=3Df49d781a992e47f7b879a78dc89=
a34de" width=3D"100%" style=3D"vertical-align: top;border-radius: 2px 2px 0=
 0;width: 100%;object-fit: cover;"/>  </a> </td></tr></table></td></tr> <tr=
><td align=3D"center" valign=3D"top" style=3D"width:560px;"><table id=3D"te=
mplateBody" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" width=3D"100%"=
 max-width=3D"560px" style=3D"margin:0 auto; max-width:560px;"><tr><td vali=
gn=3D"top" class=3D"bodyContent" id=3D"bodyContent" style=3D"max-width:560p=
x;" width=3D"100%" max-width=3D"560px" margin-left=3D"auto"><div class=3D"b=
ody" style=3D"background-color:#FFFFFF;" id=3D"templateBodyContent"><!-- [i=
f mso | IE]><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspac=
ing=3D"0" style=3D"max-width:560px;;margin:0 auto;" width=3D"100%" max-widt=
h=3D"560px"><tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-=
rule:exactly;max-width:560px;" width=3D"100%" max-width=3D"560px"><![endif]=
--><div style=3D"background:#FFFFFF;background-color:#FFFFFF;display:block;=
 margin:0px auto; max-width:600px;"><table align=3D"center" border=3D"0" ce=
llpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"background=
:#FFFFFF;background-color:#FFFFFF; margin:0 auto;" max-width=3D"560px" marg=
in-left=3D"auto"><tbody><tr><td style=3D"direction:ltr;font-size:14px;paddi=
ng:36px 18px;text-align:center;vertical-align:top;max-width:560px;" align=
=3D"center" width=3D"100%" max-width=3D"560px" margin-left=3D"auto"> <!-- [=
if mso | IE]><table role=3D"presentation" border=3D"0" cellpadding=3D"0" ce=
llspacing=3D"0" width=3D"100%" style=3D"margin:0 auto"> <![endif]--> <!-- [=
if mso | IE]><tr><td class=3D"body-message-outlook" width=3D"600px"><table =
align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" class=3D"=
body-message-outlook" style=3D"width:600px;margin:0 auto;" width=3D"600px">=
<tr><td style=3D"line-height:0px;font-size:0px;mso-line-height-rule:exactly=
;"><![endif]--><div class=3D"body-message" style=3D"margin:0px auto;max-wid=
th:600px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspaci=
ng=3D"0" role=3D"presentation" style=3D"margin: 0 auto; width: 100%;" width=
=3D"100%"><tbody style=3D"margin: 0;"><tr style=3D"margin: 0;"><td style=3D=
"margin: 0; direction: ltr; font-size: 0px; padding: 0; text-align: center;=
 vertical-align: top;max-width:560px;" align=3D"center" valign=3D"top" max-=
width=3D"560px" margin-left=3D"auto"> <!-- [if mso | IE]><table role=3D"pre=
sentation" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" style=3D"margin=
:0 auto"><tr><td style=3D"vertical-align:top;width:560px;"><![endif]--><div=
 class=3D"mj-column-per-100 outlook-group-fix" style=3D"margin: 0; font-siz=
e: 13px; direction: ltr; display: inline-block; vertical-align: top; width:=
 100%;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"pre=
sentation" width=3D"100%" style=3D"margin: 0 auto;"><tbody style=3D"margin:=
 0;"><tr style=3D"margin: 0;"><td style=3D"margin: 0; vertical-align: top; =
padding: 0;width:560px;" valign=3D"top"><table border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0" role=3D"presentation" width=3D"100%" style=3D"margin: =
0 auto;"><tr style=3D"margin: 0;"><td class=3D"body-message-text" style=3D"=
margin: 0; font-size: 0px; padding: 0x; word-break: break-word;width:560px;=
"><div id=3D"body-message" style=3D"margin: 0; font-size: 15px; line-height=
: 1.4; color: #444444;"><p><div style=3D"text-align:center"><h1>Reuni=C3=B3=
n de Networking Empresarial</h1><p>La Mesa de Negocios es un encuentro excl=
usivo dise=C3=B1ado para reunir empresarios del sector de servicios en una =
ma=C3=B1ana de networking profesional, con foco en generar conexiones estra=
t=C3=A9gicas y oportunidades reales de negocio.</p></div></p></div></td></t=
r></table></td></tr></tbody></table></div> <!-- [if mso | IE]></td></tr></t=
able><![endif]--></td></tr></tbody></table></div> <!-- [if mso | IE]></td><=
/tr></table></td></tr><![endif]--><div class=3D"component spacer" style=3D"=
Margin: 0px auto; max-width: 560px;"><table align=3D"center" border=3D"0" c=
ellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=3D"width:100=
%; margin:0 auto;" width=3D"100%"><td align=3D"left" valign=3D"top" width=
=3D"100%" height=3D"40" style=3D"border-collapse:collapse; mso-table-lspace=
: 0pt; mso-table-rspace: 0pt; mso-line-height-rule: exactly; line-height: 4=
0px;"><!--[if gte mso 15]>&nbsp;<![endif]--></td></table></div> <div class=
=3D"events--featured" style=3D"margin: 0 auto;max-width: 560px;"> <div styl=
e=3D"margin-bottom: 40px;"><div class=3D"event--featured" style=3D"backgrou=
nd: #ffffff;;max-width: 560px;box-shadow: 0 16px 64px -16px rgba(46,55,77,0=
.1); border: solid 1px #EEEDF2;;"> <a href=3D"https://www.eventbrite.com/o=
rganizations/missive/activity/redirect/=3Fp=3DABIdvVtzCoytVx-LZ0vWxd0sPzBdL=
BGny_Aa75XVNgmGzlBOd94lJy-EEnc2n-FKocKGi71-JuRnjdn0SHys3_TAXcJ7KZP3La4hPQMu=
7t6bAJ3owyhXuxvG15o3FTf3F5Pqqht2KF2hvZRoriMB4i38_oh52EIf3_cZpWvpvIvpKtwSjKQ=
cOBOXXBwN2hjEKDV5JbrTC5VOJLfgjdAAd2FWAcFfBXun_nccCiJ46QFpMjHRiV1e4Tm-0qzHp8=
BTVp-ALdy4ddvemWAl2qCUlgb8LZDsnjyuZaEHdcD71FjQ4UEnphQSVI625mf3hgR5yagM-RSdI=
rA4r6rGRu11tGGkByBEDa-4D5UfBGwTT-LztP4sLjzDCFfQbeg8iPPmoF8TDoscRtKhkAVYycpa=
jTL0fTuu_tGmcAf2-49NnUL0Aw65vp-B5AvJOnXQ1pYkTCDKfOPprIFAEvSHNwxXC9ZCnH0n8O5=
GauJtqQmQQ2clZV5rpXN5U-eameYuLGxZ4OD6XnO6mXL0oAXH8Dfp-gK9HTuh2v2FwAsb1k-1j7=
126FReZKBVDKAUvQCvyti8IcDcUQg3Avtq&eid=3D1987358292150&c=3D55300730&co=3D45=
64581911&t=3De" style=3D"text-decoration:none;" target=3D"_blank" rel=3D"no=
referrer noopener"><table cellpadding=3D"0" cellspacing=3D"0" border=3D"0" =
margin-left=3D"auto" max-width=3D"560px" style=3D"height:200px; margin:0 au=
to;"><tr><td bgcolor=3D"#F8F8F8" margin-left=3D"auto" width=3D"100%" valign=
=3D"top" style=3D"max-width:560px;"> <img src=3D"https://img.evbuc.com/http=
s%3A%2F%2Fcdn.evbuc.com%2Fimages%2F1182080326%2F739815347473%2F1%2Foriginal=
.20260413-212649=3Fcrop=3Dfocalpoint&amp;fit=3Dcrop&amp;auto=3Dformat%2Cco=
mpress&amp;q=3D75&amp;sharp=3D10&amp;fp-x=3D0.5&amp;fp-y=3D0.5&amp;s=3Dbc89=
852fe8d6b8a10725b22a0094ef32" alt=3D"Event Logo" width=3D"100%" max-width=
=3D"560px" style=3D"max-width: 560px;height: auto;" /></td></tr></table> </=
a> <!--[if mso]><table role=3D"presentation" cellspacing=3D"0" cellpadding=
=3D"0" border=3D"0" width=3D"100%" max-width=3D"560px" style=3D"max-width: =
560px"><tr><td width=3D"100%" padding-top=3D"24px" max-width=3D"560px" marg=
in-left=3D"auto" style=3D"max-width: 560px; padding:24px 16px"> <![endif]--=
><div class=3D"event-body" style=3D"padding:24px 16px;text-align:left; over=
flow:hidden"> <div class=3D"event-start-date" style=3D"font-size:.875rem;li=
ne-height:1.25rem;margin-bottom:4px;font-weight:600;word-break:break-word;c=
olor:#F6682F;"><span>jueves, 30 de abril de 2026 09:00</span></div> <div cl=
ass=3D"name-button-featured"><h2 class=3D"event-name event-name-featured" s=
tyle=3D"font-size:17px;line-height:24px;margin:0;color:#3A3551;">Mesa de Ne=
gocios - Networking Empresarial</h2><div class=3D"rsvp-button-featured" sty=
le=3D"font-size:0px;white-space:nowrap;"><div border=3D"0" cellpadding=3D"0=
" cellspacing=3D"0" role=3D"presentation" style=3D"margin:0 auto;border-col=
lapse:separate;"><div bgcolor=3D"#F6682F" role=3D"presentation" style=3D"bo=
rder:none;color:#FFFFFF;cursor:auto;padding:10px 0px;" valign=3D"middle"> <=
a href=3D"https://www.eventbrite.com/organizations/missive/activity/redirec=
t/=3Fp=3DABIdvVu5Woy_Szc3f1eZmBrWk2thiZRrYiIqedSusJfaEE4PxeudiWWwotmv1oKbEu=
oVvBGZNRPQX3W9JnYTT2fHIU3aWcJCAIoH7MR40D4W3OzXUax1JqdFc9GeMUVnlEZwQy3jsmqew=
mkg-og1at-TrgO1iYlvkYmPuDWOAzqMjcH8SN28wgqoPU4H_H1TAIIIKVo1YV71hS5I2DNQz1MN=
yFDad_GUdlJdKAiXnncSCwRld2kyoAtauqlHxXKJJzUeAG3skfrFCr3ABEbA99LICLNyVkJuM_i=
t8Ai7Z1kSdkCaUE5qXvoYWEq-GmiVqNLA8eBmu6qSj4HUAXNW5UEpWqJQGAroG57rUX4JO5cBFB=
7kPPLjEVhfweK75CSej_T99QvYmOEFlaRhxOa7FqVjn1R0nhh7OI0ORvYZn1qECakvEIZgwG67B=
p0wsMZKV2YaTsImtc9g6FSz3u2Yt6PU_Mp7zNh7RilnK5Gi1VazNHosezXaGQWlspX9fLMsa0Td=
fFJYPlMDG4W5tIaVeQ_8WcxjVcSAYHUgbt3jSUcUTlsQ5G10yXHz1OiCrII7yjUwF_rKLCGD&ei=
d=3D1987358292150&c=3D55300730&co=3D4564581911&t=3De" style=3D"background:#=
F6682F;color:#FFFFFF;font-family:'Benton Sans',-apple-system,BlinkMacSystem=
Font,Roboto,'Helvetica Neue',Helvetica,Tahoma,Arial,sans-serif;font-size:17=
px;font-weight:600;line-height:120%;Margin:0;text-decoration:none;text-tran=
sform:none;padding:12px;border-radius:4px;" target=3D"_blank" rel=3D"norefe=
rrer noopener">Entradas</a></div></div></div></div> <div class=3D"event-ven=
ue-name" style=3D"font-size:.875rem;margin-top:4px;line-height:1.25rem;colo=
r:#6f7287;font-weight:400;">Palermo Hollywood</div> </div> <!--[if mso]></t=
d></tr></table> <![endif]--></div></div> </div>  <!-- [if mso | IE]><tr><td=
 class=3D"component-outlook spacer-outlook" width=3D"5600px" style=3D"width=
:560px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=
=3D"0" class=3D"component-outlook spacer-outlook" style=3D"width:560px; mar=
gin:0 auto;" width=3D"560px"><tr><td style=3D"line-height:0px;font-size:0px=
;mso-line-height-rule:exactly;width:560px;"><![endif]--><div class=3D"compo=
nent spacer" style=3D"Margin: 0px auto; max-width: 560px;"><table align=3D"=
center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentati=
on" style=3D"width:100%; margin: 0 auto;"><tbody><tr><td style=3D"direction=
:ltr;font-size:14px;padding:0;text-align:center;vertical-align:top;width:56=
0px;"> <!-- [if mso | IE]><table role=3D"presentation" border=3D"0" cellpad=
ding=3D"0" cellspacing=3D"0" style=3D"margin:0 auto"><tr><td style=3D"verti=
cal-align:top;width:560px;"><![endif]--><div class=3D"mj-column-per-100 out=
look-group-fix" style=3D"font-size:13px;text-align:left;direction:ltr;displ=
ay:inline-block;vertical-align:top;width:100%;"><table border=3D"0" cellpad=
ding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%" style=3D"=
margin:0 auto"><tbody><tr><td style=3D"vertical-align:top;padding:0;width:5=
60px;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"pres=
entation" width=3D"100%" style=3D"margin:0 auto"><tr><td style=3D"font-size=
:0px;padding:0;word-break:break-word;width:560px;"> <!-- [if mso | IE]><tab=
le role=3D"presentation" border=3D"0" cellpadding=3D"0" cellspacing=3D"0"><=
tr><td height=3D"20" style=3D"vertical-align:top;height:20px;margin: 0 auto=
;width:560px;"><![endif]--><div style=3D"height:20px;"> &nbsp;</div> <!-- [=
if mso | IE]></td></tr></table><![endif]--></td></tr></table></td></tr></tb=
ody></table></div> <!-- [if mso | IE]></td></tr></table><![endif]--></td></=
tr></tbody></table></div> <!-- [if mso | IE]></td></tr></table></td></tr><!=
[endif]--> <!-- [if mso | IE]><tr><td class=3D"component-outlook button-out=
look" width=3D"600px"><table align=3D"center" border=3D"0" cellpadding=3D"0=
" cellspacing=3D"0" class=3D"component-outlook button-outlook" style=3D"wid=
th:560px; margin: 0 auto;" width=3D"560px"><tr><td style=3D"line-height:0px=
;font-size:0px;mso-line-height-rule:exactly;"><![endif]--><div class=3D"com=
ponent button" style=3D"Margin: 0px auto; max-width: 560px;"><table align=
=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presen=
tation" style=3D"width:100%; margin: 0 auto;"><tbody><tr><td style=3D"direc=
tion:ltr;font-size:14px;padding:0;text-align:center;vertical-align:top;"> <=
!-- [if mso | IE]><table role=3D"presentation" border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0" style=3D"margin:0 auto"><tr><td style=3D"vertical-alig=
n:top;width:560px;"><![endif]--><div class=3D"mj-column-per-100 outlook-gro=
up-fix" style=3D"font-size:13px;text-align:left;direction:ltr;display:inlin=
e-block;vertical-align:top;width:100%;"><table border=3D"0" cellpadding=3D"=
0" cellspacing=3D"0" role=3D"presentation" width=3D"100%" style=3D"margin:0=
 auto"><tbody><tr><td style=3D"vertical-align:top;padding:0;width:560px;"><=
table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation=
" width=3D"100%" style=3D"margin:0 auto"><tr><td align=3D"center" vertical-=
align=3D"middle" style=3D"font-size:0px;padding:0;word-break:break-word;wid=
th:560px;"><table align=3D"center" border=3D"0" cellpadding=3D"0" cellspaci=
ng=3D"0" role=3D"presentation" style=3D"border-collapse:separate;line-heigh=
t:100%;margin: 0 auto;"><tr><td align=3D"center" bgcolor=3D"#222222" role=
=3D"presentation" style=3D"border:none;border-left:4px solid #F6682F;border=
-radius:0;color:#FFFFFF;cursor:auto;padding:10px 25px;width:560px;" valign=
=3D"middle"> <a href=3D"https://www.eventbrite.com.ar/o/mate-valley-3909694=
5183" style=3D"background:#222222;color:#FFFFFF;font-size:16px;font-weight:=
normal;line-height:120%;Margin:0;text-decoration:none;text-transform:none;"=
 target=3D"_blank" rel=3D"noreferrer noopener"> Descubre m=C3=A1s eventos <=
/a></td></tr></table></td></tr></table></td></tr></tbody></table></div> <!-=
- [if mso | IE]></td></tr></table><![endif]--></td></tr></tbody></table></d=
iv> <!-- [if mso | IE]></td></tr></table></td></tr><![endif]--> <!-- [if ms=
o | IE]><tr><td class=3D"component-outlook spacer-outlook" width=3D"560px">=
<table align=3D"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" cl=
ass=3D"component-outlook spacer-outlook" style=3D"width:560px;margin: 0 aut=
o" width=3D"560px"><tr><td style=3D"line-height:0px;font-size:0px;mso-line-=
height-rule:exactly;width:560px;"><![endif]--><div class=3D"component space=
r" style=3D"Margin: 0px auto; max-width: 560px;"><table align=3D"center" bo=
rder=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentation" style=
=3D"width:100%;margin: 0 auto"><tbody><tr><td style=3D"direction:ltr;font-s=
ize:14px;padding:0;text-align:center;vertical-align:top;width:560px;"> <!--=
 [if mso | IE]><table role=3D"presentation" border=3D"0" cellpadding=3D"0" =
cellspacing=3D"0" width=3D"100%" style=3D"margin:0 auto"><tr><td style=3D"v=
ertical-align:top;width:560px;"><![endif]--><div class=3D"mj-column-per-100=
 outlook-group-fix" style=3D"font-size:13px;text-align:left;direction:ltr;d=
isplay:inline-block;vertical-align:top;width:100%;"><table border=3D"0" cel=
lpadding=3D"0" cellspacing=3D"0" role=3D"presentation" width=3D"100%" style=
=3D"margin:0 auto"><tbody><tr><td style=3D"vertical-align:top;padding:0;wid=
th:560px;"><table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"=
presentation" width=3D"100%" style=3D"margin:0 auto"><tr><td style=3D"font-=
size:0px;padding:0;word-break:break-word;width:560px;"> <!-- [if mso | IE]>=
<table role=3D"presentation" border=3D"0" cellpadding=3D"0" cellspacing=3D"=
0" width=3D"100%" style=3D"margin:0 auto"><tr><td height=3D"40" style=3D"ve=
rtical-align:top;height:40px;width:560px;"><![endif]--><div style=3D"height=
:40px;"> &nbsp;</div> <!-- [if mso | IE]></td></tr></table><![endif]--></td=
></tr></table></td></tr></tbody></table></div> <!-- [if mso | IE]></td></tr=
></table><![endif]--></td></tr></tbody></table></div> <!-- [if mso | IE]></=
td></tr></table></td></tr><![endif]--><!-- [if mso | IE]></table><![endif]-=
-></td></tr></tbody></table></div> <!-- [if mso | IE]></td></tr></table><![=
endif]--></div></td></tr></table><!-- - - - - - - - - -->=0A<!-- BEGIN FOOT=
ER // -->=0A<!-- - - - - - - - - -->=0A<!-- - - - - - - - - -->=0A=0A<div c=
lass=3D"footer" style=3D"margin: 0px auto; width: 100%;">=0A<table align=3D=
"center" border=3D"0" cellpadding=3D"0" cellspacing=3D"0" role=3D"presentat=
ion" style=3D"width:100%;">=0A    =0A    =0A    <!-- SOCIAL LINKS AND SEPAR=
ATOR -->=0A    <tr>=0A    <td class=3D"row_section" style=3D"padding: 0;mar=
gin-left: auto;margin-right: auto; background-color: #F8F8FA;">=0A        <=
table style=3D"padding: 0;border:0;border-collapse:collapse;border-spacing:=
0;padding:18px 0;color:#222!important;width:100%;min-width:100%;max-width:1=
00%;" class=3D"footer-content bottom-section" cellspacing=3D"0" cellpadding=
=3D"0" bgcolor=3D"" width=3D"100%">=0A            <tr class=3D"footer__info=
 align-center">=0A            <td class=3D"grid__col" style=3D"padding: 0;f=
ont-family:Benton Sans,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Ne=
ue,Helvetica,Tahoma,Arial,sans-serif;text-align:center;font-size:12px;font-=
weight:200;line-height:18px;padding: 0px 32px;" align=3D"center">=0A       =
         <!--[if (mso)|(ie)]>=0A                <table align=3D"center" bor=
der=3D"0" cellspacing=3D"0" cellpadding=3D"0" width=3D"150" height=3D"40" s=
tyle=3D"width:150px; height:40px;">=0A                    <tr>=0A          =
      <![endif]-->=0A                =0A                <!--[if (mso)|(ie)]=
>=0A                        <td width=3D"40">=0A                           =
 <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" width=3D"40" heigh=
t=3D"40" align=3D"left">=0A                                <tr>=0A         =
                           <td style=3D"padding:16px 6px; border:0px; width=
:40px; height:40px;">=0A                <![endif]-->=0A                <div=
 class=3D"social-logo-container column-left" style=3D"padding:0;display:inl=
ine-block;height:auto;margin:0;" height=3D"auto">=0A                    <a =
href=3D"https://twitter.com/matevalley_in">=0A=0A                        =
=0A                        <img src=3D"https://cdn.evbstatic.com/s3-build/p=
erm_001/6df3bc/django/images/email/missive/Twitter.png" class=3D"footer-soc=
ial-logo__image" style=3D"height:40px;padding:16px 3px 0;width:40px;" heigh=
t=3D"40" width=3D"40" alt=3D"Twitter" title=3D"Twitter" border=3D"0">=0A   =
                     =0A=0A                    </a>=0A                </div=
>=0A                <!--[if (mso)|(ie)]>=0A                                =
    </td>=0A                                </tr>=0A                       =
     </table>=0A                        </td>=0A                <![endif]--=
>=0A                =0A                =0A                <!--[if (mso)|(ie=
)]>=0A                        <td width=3D"40">=0A                         =
   <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" width=3D"40" hei=
ght=3D"40" align=3D"center">=0A                                <tr>=0A     =
                               <td style=3D"text-align:center; padding:16px=
 6px; border:0px; width:40px; height:40px;">=0A                <![endif]-->=
=0A                <div class=3D"social-logo-container column-center" style=
=3D"padding:0;display:inline-block;height:auto;margin:0;" height=3D"auto">=
=0A                    <a href=3D"https://www.facebook.com/matevalley.in" t=
arget=3D"_blank" aria-label=3D"Eventbrite Facebook">=0A                    =
    =0A                        <img src=3D"https://cdn.evbstatic.com/s3-bui=
ld/perm_001/88f748/django/images/email/missive/Facebook.png" class=3D"foote=
r-social-logo__image" style=3D"height:40px;padding:16px 3px 0;width:40px;" =
height=3D"40" width=3D"40" alt=3D"Facebook" title=3D"Facebook" border=3D"0"=
>=0A                        =0A=0A                    </a>=0A              =
  </div>=0A                <!--[if (mso)|(ie)]>=0A                         =
           </td>=0A                                </tr>=0A                =
            </table>=0A                        </td>=0A                <![e=
ndif]-->=0A                =0A                =0A                <!--[if (m=
so)|(ie)]>=0A                        <td width=3D"40">=0A                  =
          <table border=3D"0" cellpadding=3D"0" cellspacing=3D"0" width=3D"=
40" height=3D"40" align=3D"right">=0A                                <tr>=
=0A                                    <td style=3D"text-align:right; paddi=
ng:16px 6px; border:0px; width:40px; height:40px;">=0A                <![en=
dif]-->=0A                <div class=3D"social-logo-container column-right"=
 style=3D"padding:0;display:inline-block;height:auto;margin:0;" height=3D"a=
uto">=0A                    <a href=3D"https://instagram.com/matevalley.in"=
 target=3D"_blank" aria-label=3D"Eventbrite Instagram">=0A                 =
       =0A                        <img src=3D"https://cdn.evbstatic.com/s3-=
build/perm_001/371295/django/images/email/missive/Instagram.png" class=3D"f=
ooter-social-logo__image" style=3D"height:40px;padding:16px 3px 0;width:40p=
x;" height=3D"40" width=3D"40" alt=3D"Instagram" title=3D"Instagram" border=
=3D"0">=0A                        =0A=0A                    </a>=0A        =
        </div>=0A                <!--[if (mso)|(ie)]>=0A                   =
                 </td>=0A                                </tr>=0A          =
                  </table>=0A                        </td>=0A              =
  <![endif]-->=0A                =0A                <!--[if (mso)|(ie)]>=0A=
                    </tr>=0A                </table>=0A                <![e=
ndif]-->=0A            </td>=0A        </tr>=0A        </table>=0A    </td>=
=0A    </tr>=0A=0A    <tr>=0A        <td class=3D"row_section" style=3D"pad=
ding: 0;margin-left: auto;margin-right: auto; background-color: #F8F8FA;">=
=0A        <table style=3D"padding: 0;background-color: #F8F8FA;border:0;bo=
rder-collapse:collapse;border-spacing:0;padding:0;color:#222!important;widt=
h:100%;min-width:100%;max-width:100%;" class=3D"footer-content bottom-secti=
on" cellspacing=3D"0" cellpadding=3D"0" bgcolor=3D"#F8F8FA" width=3D"100%">=
=0A            <!--[if (mso)|(ie)]>=0A            <tr>=0A                <t=
d width=3D"100%">=0A                    <table align=3D"center" border=3D"0=
" cellspacing=3D"0" cellpadding=3D"0" width=3D"70%" style=3D"width:70%;">=
=0A                        <tr>=0A                            <td height=3D=
"1" width=3D"70%" style=3D"line-height:1px;width:70%; font-size:1px;" bgcol=
or=3D"#dedede>&nbsp;</td>=0A                        </tr>=0A               =
     </table>=0A                </td>=0A            </tr>=0A            <![=
endif]-->=0A        </table>=0A        </td>=0A    </tr>=0A    <!--// END S=
OCIAL LINKS AND SEPARATOR-->=0A    =0A=0A    <!-- COMPANY METADATA -->=0A  =
  <tr>=0A        <td class=3D"row_section" style=3D"padding: 0;margin-left:=
 auto;margin-right: auto;">=0A            <table style=3D"padding: 0;backgr=
ound-color: #F8F8FA;border:0;border-collapse:collapse;border-spacing:0;padd=
ing:0;width:100%;color:#222!important;" class=3D"footer-content bottom-sect=
ion" cellspacing=3D"0" cellpadding=3D"0" width=3D"100%" bgcolor=3D"#F8F8FA"=
>=0A            <tr class=3D"footer__info align-center">=0A                =
<td class=3D"grid__col" style=3D"padding: 0;font-family:Benton Sans,-apple-=
system,BlinkMacSystemFont,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,sans=
-serif;text-align: center;font-size: 12px;font-weight: 200;line-height: 18p=
x;padding: 12px 32px 8px;" align=3D"center">=0A                <!--[if (mso=
)|(ie)]>=0A                <table align=3D"center" border=3D"0" cellspacing=
=3D"0" cellpadding=3D"0" width=3D"100%" style=3D"text-align:center; width:1=
00%;">=0A                <![endif]-->=0A                =0A                =
<!--[if (mso)|(ie)]>=0A                    <tr>=0A                        <=
td style=3D"text-align:center; padding:16px 6px; border:0px;font-size: 12px=
;line-height: 18px;font-weight: 200;">=0A                <![endif]-->=0A   =
             <div class=3D"footer-row__text" style=3D"font-family:Benton Sa=
ns,-apple-system,BlinkMacSystemFont,Roboto,Helvetica Neue,Helvetica,Tahoma,=
Arial,sans-serif;padding:0;padding-bottom: 8px; font-size: 11px">=0A       =
             <span>Mate Valley</span>=0A                </div>=0A          =
      <!--[if (mso)|(ie)]>=0A                        </td>=0A              =
      </tr>=0A                <![endif]-->=0A                =0A           =
     =0A                <!--[if (mso)|(ie)]>=0A                    <tr>=0A =
                       <td style=3D"text-align:center; padding-bottom:6px; =
border: 0px;font-size: 12px;line-height: 18px;font-weight: 200;">=0A       =
         <![endif]-->=0A                <div class=3D"footer-row__text" sty=
le=3D"font-family:Benton Sans,-apple-system,BlinkMacSystemFont,Roboto,Helve=
tica Neue,Helvetica,Tahoma,Arial,sans-serif;padding:0;padding-bottom: 8px;"=
>=0A                    Avenida Corrientes 800, CABA, Buenos Aires 1017 AR=
=0A                </div>=0A                <!--[if (mso)|(ie)]>=0A        =
                </td>=0A                    </tr>=0A                <![endi=
f]-->=0A                =0A                <!--[if (mso)|(ie)]>=0A         =
           <tr>=0A                        <td style=3D"text-align:center; p=
adding-bottom:6px; border:0px;font-size: 12px;line-height:18px;font-weight:=
 200;">=0A                <![endif]-->=0A                <div class=3D"foot=
er-row__text" style=3D"font-family:Benton Sans,-apple-system,BlinkMacSystem=
Font,Roboto,Helvetica Neue,Helvetica,Tahoma,Arial,sans-serif;font-size:11px=
;padding:0;padding-bottom: 18px;">=0A                    <span><a class=3D"=
footer-unsubscribe-link" href=3D"https://www.eventbrite.com.ar/organization=
s/missive/activity/unsubscribe/=3Fp=3DABIdvVs3Vy7J7r1W-yVTapDh4rMRgmR8hf5rh=
hyDGaWkbitb3_a0VV2F-Zu_-qIiaoiZHig00-v2p7zoZ93y_S86D9F1a8qKNZx10n_7O2Ut2kzR=
03K2J_K34pVvFGtRTj-9Bv3haMdEXv6BXXZ3IZIUvHGqs-7s0QkXmwGgUh4ZnNlxZs33AHp-Sgv=
yqhQOEYNfXfyb1t9eoeRa8yz3EhLoVbe3o6URpqey7HRxI2wKFc8V-l4cJIRTvF24c_nqbsQWZs=
51nX8kYgffbbO_mqyFHgXF7qVsRA&c=3D55300730&co=3D4564581911" style=3D"color: =
#222222;text-decoration:none !important;" target=3D"_blank" rel=3D"noreferr=
er noopener">Cancelar inscripci=C3=B3n</a></span>=0A                    &nb=
sp;|&nbsp;=0A                    <span><a class=3D"footer-privacy-link" hre=
f=3D"https://www.eventbrite.com.ar/privacypolicy=3Flocale=3Des_AR" style=3D=
"color: #222222;text-decoration:none !important;" target=3D"_blank" rel=3D"=
noreferrer noopener">Pol=C3=ADtica de privacidad</a></span>=0A             =
   </div>=0A                <!--[if (mso)|(ie)]>=0A                        =
</td>=0A                    </tr>=0A                </table>=0A            =
    <![endif]-->=0A                </td>=0A            </tr>=0A        </ta=
ble>=0A        </td>=0A    </tr>=0A</table>=0A</div>=0A<!-- - - - - - - - -=
 -->=0A<!-- - - - - - - - - -->=0A<!-- // END FOOTER -->=0A<!-- - - - - - -=
 - - -->=0A<!-- - - - - - - - - -->=0A</td></tr><tr><td align=3D"center" va=
lign=3D"top" style=3D"width:560px; padding:0px; margin:0px;"> <img src=3D"h=
ttps://www.eventbrite.com/organizations/missive/activity/pixel.gif=3Fp=3DAB=
IdvVuGYJNVWQvu0-yXkzd5F3yr1zTyOvqZ3AccG4IgSOUwTxCvXVc22yDiabGRa9ZTsT5ByXuPL=
Lz1HYo_ghHN9j0bG4Ixt7hOybj99RUY_Vleo60WxesIRqChRYv6MquzOlH6fF6OB7Rps_APWDjW=
4MZTqxIsgmpHtCRTaaHJBAh3EZurU5I&c=3D55300730&co=3D4564581911" alt=3D"" widt=
h=3D"1" height=3D"1" border=3D"0" style=3D"border: 0;"></td></tr> </table> =
<script type=3D"text/plain">darkThemeSupport=3Dtrue backgroundImageSupport=
=3Dtrue headerImageLinkSupport=3Dtrue</script> </td></tr></table></center>=
=0D=0A<img border=3D"0" width=3D"1" height=3D"1" alt=3D"" src=3D"https://cl=
icks.eventbrite.com/q/8Tbjz3f9XY7HfPj1jVKTiA~~/AAQxARA~/B9dCFdWtkMuM80R3q4J=
AkeIL2VB4bK0ituQTUSzQJhtS1Ws5pb_kk8UnT8WN3Akzg04pCWQoijjR0BXcop1AoQ~~">=0D=
=0A</body></html>
--_----jrONktnqr/YN/LLEUyo6uA===_64/6F-49407-0D395E96--

