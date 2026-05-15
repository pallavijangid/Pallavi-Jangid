import { ANON_IDENTIFICATION_URL } from "https://page.brightmoney.co/constants-metrics.js";

// --- CSS INJECTION FOR STATE RESET ---
// We inject a style rule that uses !important to override the existing hover CSS.
// This is necessary because the existing CSS uses !important on :hover.
try {
    const styleReset = document.createElement('style');
    styleReset.innerHTML = `
        .force-reset-state {
            transform: none !important;
            box-shadow: none !important;
            pointer-events: none !important; /* Prevents further hover/active triggers */
            transition: none !important; /* snaps back instantly */
        }
    `;
    document.head.appendChild(styleReset);
} catch (e) {
    console.error("Could not inject reset styles", e);
}

let webFlow = !0,
    page = "PLA_001",
    defaultUTMSource = "org",
    defaultUTMMedium = "org",
    defaultUTMCampaign = "org",
    fbp = "",
    fbc = "",
    urlToOpen = `https://b.sng.link/Au8kf/s64k/u3kk`,
    anonId = "",
    dynamicDeeplink = "",
    cookie_consent_id = "",
    cookie_preferences = "",
    cookie_accepted = "NOT_INTERACTED",
    LPFallbackDeepLink = webFlow ? "https://app.brightmoney.co/?" : "../../b.sng.link/Au8kf/s64k/u3kk";
const utm = new URLSearchParams(window.location.search);
try {
    (function (document, mixpanel) {
        if (!mixpanel.__SV) {
            var script,
                firstScript,
                win = window;
            try {
                var loc = win.location,
                    hash = loc.hash;
                let getParam = (str, key) => {
                    let match = str.match(RegExp(key + "=([^&]*)"));
                    return match ? match[1] : null;
                };
                if (hash && getParam(hash, "state")) {
                    let state = JSON.parse(decodeURIComponent(getParam(hash, "state")));
                    if (state.action === "mpeditor") {
                        win.sessionStorage.setItem("_mpcehash", hash);
                        history.replaceState(state.desiredHash || "", document.title, loc.pathname + loc.search);
                    }
                }
            } catch (e) {}
            win.mixpanel = mixpanel;
            mixpanel._i = [];
            mixpanel.init = function (token, config, name) {
                function stubFunc(obj, method) {
                    let parts = method.split(".");
                    if (parts.length === 2) {
                        obj = obj[parts[0]];
                        method = parts[1];
                    }
                    obj[method] = function () {
                        obj.push([method].concat(Array.prototype.slice.call(arguments)));
                    };
                }
                let instance = mixpanel;
                if (name !== undefined) {
                    instance = mixpanel[name] = [];
                } else {
                    name = "mixpanel";
                }
                instance.people = instance.people || [];
                instance.toString = function (short) {
                    let str = "mixpanel";
                    if (name !== "mixpanel") str += "." + name;
                    return short ? str : str + " (stub)";
                };
                instance.people.toString = () => instance.toString(1) + ".people (stub)";
                let methods = "disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(
                    " "
                );
                for (let i = 0; i < methods.length; i++) {
                    stubFunc(instance, methods[i]);
                }
                let groupMethods = "set set_once union unset remove delete".split(" ");
                instance.get_group = function () {
                    let groupArgs = ["get_group"].concat(Array.prototype.slice.call(arguments));
                    let obj = {};
                    groupMethods.forEach((method) => {
                        obj[method] = function () {
                            let callArgs = [method].concat(Array.prototype.slice.call(arguments));
                            instance.push([groupArgs, callArgs]);
                        };
                    });
                    return obj;
                };
                mixpanel._i.push([token, config, name]);
            };
            mixpanel.__SV = 1.2;
            script = document.createElement("script");
            script.type = "text/javascript";
            script.async = !0;
            script.src =
                typeof MIXPANEL_CUSTOM_LIB_URL !== "undefined"
                    ? MIXPANEL_CUSTOM_LIB_URL
                    : document.location.protocol === "file:" && "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)
                    ? "https://cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js"
                    : "//cdn4.mxpnl.com/libs/mixpanel-2-latest.min.js";
            firstScript = document.getElementsByTagName("script")[0];
            firstScript.parentNode.insertBefore(script, firstScript);
        }
    })(document, window.mixpanel || []);
    mixpanel.init("5c4ae61de26c90f5494a07eb41e1d9d5");
} catch (e) {}
function sendAnalyticsCall(event, data, optional) {
    try {
        if (window.mixpanel) {
            window.mixpanel.track(event, { ...(data || {}), ...(utm || {}), fbp, fbc, page, anonId });
        }
    } catch (e) {}
}
function trackClevertapEvent(event, eventData = {}) {
    try {
        clevertap.event.push(event, eventData);
    } catch (e) {
        sendAnalyticsCall("CLEVERTAP_EVENT_ERROR", { error: JSON.stringify(e), event, eventData });
    }
}
function pushToCTUserProfile(profileData) {
    try {
        clevertap.profile.push({ Site: profileData });
    } catch (e) {
        sendAnalyticsCall("CLEVERTAP_PROFILE_PUSH_ERROR", { error: JSON.stringify(e) });
    }
}
function requestCTNotificationPermission() {
    try {
        clevertap.notifications.push({
            titleText: "Hello? Still out there?",
            bodyText: "We'd still love to work with you. Activate Bright now.",
            okButtonText: "Unlock Now",
            rejectButtonText: "No thanks",
            okButtonColor: "#17C95F",
            askAgainTimeInSeconds: 3600,
            serviceWorkerPath: "/sw_webpush.js",
        });
    } catch (e) {
        sendAnalyticsCall("CLEVERTAP_NOTIFICATION_REQUEST_ERROR", { error: JSON.stringify(e) });
    }
}
const callAPI = ({ url, method, payload, completeFn = () => !0, errorFn = () => !1, timeout = 3000 }) =>
    new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            const error = new Error("Timeout");
            errorFn(error);
            mixpanel.track("LANDING_PAGE_CALLAPI_TIMEOUT", { error: JSON.stringify(error), url, method, timeout, payload: JSON.stringify(payload) });
            reject(error);
        }, timeout);
        fetch(url, { method, body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } })
            .then((res) => res.json())
            .then((data) => {
                clearTimeout(timer);
                completeFn(data);
                resolve(data);
            })
            .catch((err) => {
                clearTimeout(timer);
                errorFn(err);
                mixpanel.track("LANDING_PAGE_CALLAPI_FAILED", { error: JSON.stringify(err), url, method, payload: JSON.stringify(payload) });
                reject(err);
            });
    });
function eraseCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
function setCookie(name, value, hours) {
    let expires = "";
    if (hours) {
        const date = new Date();
        date.setTime(date.getTime() + hours * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value || ""}${expires}; domain=.brightmoney.co; path=/`;
}
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function setConsentListener() {
    if (getCookie("privado_timeout") !== "set") {
        eraseCookie("preferences");
        eraseCookie("last_consent");
        setTimeout(() => {
            setCookie("privado_timeout", "set", 6);
        }, 1000);
    }
    const banner = document.getElementById("cookie-consent-banner");
    if (!banner) return;
    const acceptBtn = document.getElementById("accept-button");
    const denyBtn = document.getElementById("deny-button");
    const manageBtn = document.getElementById("manage-settings-button");
    const closeBtn = document.getElementById("banner-close-icon");
    const handleConsent = (accepted, callback = () => {}) => {
        setTimeout(() => {
            cookie_accepted = accepted ? "cookie_accepted" : "cookie_rejected";
            cookie_consent_id = getCookie("last_consent");
            cookie_preferences = getCookie("preferences");
            anonIdCall({ cookie_accepted, cookie_consent_id, cookie_preferences });
            callback(cookie_accepted, cookie_consent_id, cookie_preferences);
        }, 400);
    };
    acceptBtn.addEventListener("click", () => {
        handleConsent(!0, (accepted, id, prefs) => {
            sendAnalyticsCall("COOKIE_ACCEPT_BUTTON_CLICKED", { page, cookie_accepted: accepted, cookie_consent_id: id, cookie_preferences: prefs, anonId });
        });
    });
    denyBtn.addEventListener("click", () => {
        handleConsent(!1, (accepted, id, prefs) => {
            sendAnalyticsCall("COOKIE_REJECT_BUTTON_CLICKED", { page, cookie_accepted: accepted, cookie_consent_id: id, cookie_preferences: prefs, anonId });
        });
    });
    manageBtn.addEventListener("click", () => {
        sendAnalyticsCall("COOKIE_MANGAGE_BUTTON_CLICKED", { page, anonId });
    });
    closeBtn.addEventListener("click", () => {
        sendAnalyticsCall("COOKIE_CLOSE_BUTTON_CLICKED", { page, anonId });
    });
}
async function anonIdCall(extraData = {}) {
    anonId = localStorage.getItem("ANONYMOUS_ID") || getCookie("ANONYMOUS_ID");
    const payload = {
        meta: {},
        data: {
            anon_id: anonId || "",
            utm: {
                utm_source: utm.get("utm_source") || defaultUTMSource,
                utm_medium: utm.get("utm_medium") || defaultUTMMedium,
                utm_campaign: utm.get("utm_campaign") || defaultUTMCampaign,
                utm_adset: utm.get("utm_adset") || "",
                utm_ad: utm.get("utm_ad") || "",
                utm_keyword: utm.get("utm_keyword") || "",
                utm_content: utm.get("utm_content") || "",
                ...extraData,
            },
            lp_id: page || "",
            fb_details: { fbp, fbc },
        },
    };
    try {
        const response = await callAPI({ url: "https://gateway.brightmoney.co/api/v1/anon_user/id/", method: "POST", payload });
        if (response?.data?.anon_id) {
            anonId = response.data.anon_id;
            dynamicDeeplink = response.data.deeplink;
            localStorage.setItem("ANONYMOUS_ID", anonId);
            setCookie("ANONYMOUS_ID", anonId, 87600);
            window.mixpanel.identify(anonId);
            sendAnalyticsCall("ANONYMOUS_ID_FETCH_SUCCESS", {});
            pushToCTUserProfile({ Site: { anonId } });
        } else {
            sendAnalyticsCall("ANONYMOUS_ID_WRONG_OR_EMPTY", {});
        }
    } catch (e) {
        sendAnalyticsCall("ANONYMOUS_ID_FETCH_FAILED", { error: JSON.stringify(e) });
    }
}

function buildSingularUrl(baseUrl, page, anonId) {
    if (!baseUrl) return "";

    const ddlValue = `https://app.brightmoney.co?page=${page}&anon_id=${anonId || ""}`;
    const encodedDDL = encodeURIComponent(ddlValue);

    const separator = baseUrl.includes("?") ? "&" : "?";

    return `${baseUrl}${separator}_ddl=${encodedDDL}`;
}

async function init() {
    fbp = getCookie("_fbp");
    fbc = getCookie("_fbc");
    await anonIdCall();
    sendAnalyticsCall("LANDING_PAGE_SEEN");
    sendAnalyticsCall(`LANDING_PAGE_${page}_SEEN`);
    setTimeout(setConsentListener, 500);
    trackClevertapEvent("LANDING_JOIN_SEEN", { page: "app.bm" || window.location.pathname || "unknown", url: window.location.href, anonId, domain: "app.brightmoney.co" });
    requestCTNotificationPermission();
    
    // --- FORCE RESET BUTTON STATE HELPER ---
    // Applies a class that strictly enforces normal state via !important.
    const forceResetElement = (el) => {
        if (!el) return;
        if (el.blur) el.blur();
        el.classList.add('force-reset-state');
    };

    // --- PAGESHOW HANDLER ---
    // When page is restored (back button), remove the class after a short delay
    // to allow the browser to settle, then restore interactivity.
    window.addEventListener('pageshow', (event) => {
        setTimeout(() => {
            document.querySelectorAll(".force-reset-state").forEach((el) => {
                el.classList.remove('force-reset-state');
            });
        }, 300);
    });

    // Add mouseout/mouseleave handlers to reset CTA button state
    try {
        document.querySelectorAll(".cta, .persistent-cta, .loan-download-cta-button, .footer-download-cta-button").forEach((btn) => {
            btn.addEventListener("mouseout", (e) => {
                e.currentTarget.style.transform = "";
            });
            btn.addEventListener("mouseleave", (e) => {
                e.currentTarget.style.transform = "";
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_MOUSEOUT_HANDLER_ERROR", { error: JSON.stringify(e) });
    }
    
    // Update Click Handlers to use forceResetElement
    try {
        let urlToOpenTemp = webFlow ? buildSingularUrl(urlToOpen, page, anonId) : dynamicDeeplink;
        document.querySelectorAll(".cta").forEach((cta) => {
            cta.addEventListener("click", (e) => {
                const target = e.currentTarget;
                sendAnalyticsCall("LANDING_PAGE_INSTALL_APP_CLICK");
                sendAnalyticsCall("LP_CTA_CLICK_FE_CALL_COMPLETE");
                
                // Force reset visible state using !important class
                forceResetElement(target);
                
                setTimeout(() => {
                    window.open(urlToOpenTemp || LPFallbackDeepLink, "_self");
                }, 250);
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_CLICK_ERROR", { error: JSON.stringify(e) });
    }
    try {
        urlToOpen = webFlow ? buildSingularUrl(urlToOpen, page, anonId) : dynamicDeeplink;
        document.querySelectorAll(".action-link").forEach((cta) => {
            cta.addEventListener("click", (e) => {
                const target = e.currentTarget;
                sendAnalyticsCall("LANDING_PAGE_INSTALL_APP_CLICK");
                sendAnalyticsCall("LP_CTA_CLICK_FE_CALL_COMPLETE");
                
                forceResetElement(target);
                
                setTimeout(() => {
                    window.open(urlToOpen || LPFallbackDeepLink, "_self");
                }, 250);
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_CLICK_ERROR", { error: JSON.stringify(e) });
    }
    try {
        urlToOpen = webFlow ? buildSingularUrl(urlToOpen, page, anonId) : dynamicDeeplink;
        document.querySelectorAll(".store-link.app-store").forEach((cta) => {
            cta.addEventListener("click", (e) => {
                const target = e.currentTarget;
                sendAnalyticsCall("LANDING_PAGE_INSTALL_APP_CLICK");
                sendAnalyticsCall("LP_CTA_CLICK_FE_CALL_COMPLETE");
                
                forceResetElement(target);
                
                setTimeout(() => {
                    window.open(urlToOpen || LPFallbackDeepLink, "_self");
                }, 250);
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_CLICK_ERROR", { error: JSON.stringify(e) });
    }
    try {
        urlToOpen = webFlow ? buildSingularUrl(urlToOpen, page, anonId) : dynamicDeeplink;
        document.querySelectorAll(".store-link.play-store").forEach((cta) => {
            cta.addEventListener("click", (e) => {
                const target = e.currentTarget;
                sendAnalyticsCall("LANDING_PAGE_INSTALL_APP_CLICK");
                sendAnalyticsCall("LP_CTA_CLICK_FE_CALL_COMPLETE");
                
                forceResetElement(target);
                
                setTimeout(() => {
                    window.open(urlToOpen || LPFallbackDeepLink, "_self");
                }, 250);
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_CLICK_ERROR", { error: JSON.stringify(e) });
    }
    try {
        urlToOpen = webFlow ? buildSingularUrl(urlToOpen, page, anonId) : dynamicDeeplink;
        document.querySelectorAll(".gradient-underline").forEach((cta) => {
            cta.addEventListener("click", (e) => {
                const target = e.currentTarget;
                sendAnalyticsCall("LANDING_PAGE_INSTALL_APP_CLICK");
                sendAnalyticsCall("LP_CTA_CLICK_FE_CALL_COMPLETE");
                
                forceResetElement(target);
                
                setTimeout(() => {
                    window.open(urlToOpen || LPFallbackDeepLink, "_self");
                }, 250);
            });
        });
    } catch (e) {
        sendAnalyticsCall("CTA_CLICK_ERROR", { error: JSON.stringify(e) });
    }
}
try {
    init();
} catch (e) {
    setTimeout(() => {
        window.open("https://app.brightmoney.co");
    }, 500);
}
const session_id = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
const timestamp = new Date().toISOString();
let firstTouchPoint = "scroll";
let lastTouchPoint = "scroll";
function sendEventToBackend(eventName, eventData = {}) {
    const payload = { meta: { session_id: session_id, anon_id: anonId }, data: { event_name: eventName, event_data: eventData } };
    try {
        fetch(ANON_IDENTIFICATION_URL, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "application/json" } })
            .then((res) => res.json())
            .then((data) => {})
            .catch((err) => {
                console.error("Backend error:", eventName, err);
            });
    } catch (err) {
        console.error("Backend fetch crashed:", err);
    }
}
window.addEventListener("load", async function () {
    await anonIdCall();
    let webJourneyStarted = !1;
    ["click", "keydown", "scroll"].forEach((eventType) => {
        document.addEventListener(
            eventType,
            (e) => {
                if (!webJourneyStarted) {
                    webJourneyStarted = !0;
                    const deviceInfo = navigator.userAgent.toLowerCase();
                    const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
                    const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
                    const target = e.target;
                    const tagName = target.tagName?.toLowerCase();
                    const extractTouchPoint = (el) => {
                        if (!el) return "unknown";
                        if (el.tagName?.toLowerCase() === "img" || el.tagName?.toLowerCase() === "video") {
                            const src = el.getAttribute("src") || el.currentSrc || el.getAttribute("href") || "";
                            return src ? src.split("/").pop() : "unknown";
                        }
                        return el.innerText?.trim()?.slice(0, 500) || el.getAttribute("alt") || el.getAttribute("aria-label") || "unknown";
                    };
                    if (firstTouchPoint === "scroll") {
                        firstTouchPoint = extractTouchPoint(target);
                    }
                    lastTouchPoint = extractTouchPoint(target);
                    sendEventToBackend("WEB_JOURNEY_STARTED_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", trigger: eventType, first_touch_point: firstTouchPoint, last_touch_point: lastTouchPoint, timestamp: timestamp });
                    sendAnalyticsCall("WEB_JOURNEY_STARTED", {
                        Trigger: eventType,
                        "LP Name": typeof page !== "undefined" ? page : "unknown",
                        "First Touch Point": firstTouchPoint,
                        "Last Touch Point": lastTouchPoint,
                        "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                        "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                        "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                        "UTM Content": urlParams.get("utm_content") || "unknown",
                        Device: device,
                    });
                }
            },
            { once: !0 }
        );
    });
    document.body.addEventListener("click", (e) => {
        const target = e.target;
        const isCTA = target.closest(".cta, .store-link");
        const isGenericLinkClick = target.closest("a[href], button, [role='button'], [onclick], input[type='submit'], label, img, svg, [tabindex], .clickable, [data-trackable]");
        if (!isCTA && isGenericLinkClick) {
            const tagName = target.tagName?.toLowerCase();
            const extractTouchPoint = (el) => {
                if (!el) return "unknown";
                if (el.tagName?.toLowerCase() === "img" || el.tagName?.toLowerCase() === "video") {
                    const src = el.getAttribute("src") || el.currentSrc || el.getAttribute("href") || "";
                    return src ? src.split("/").pop() : "unknown";
                }
                return el.innerText?.trim()?.slice(0, 100) || el.getAttribute("alt") || el.getAttribute("aria-label") || "unknown";
            };
            if (firstTouchPoint === "scroll") {
                firstTouchPoint = extractTouchPoint(target);
            }
            lastTouchPoint = extractTouchPoint(target);
            sendEventToBackend("LANDING_PAGE_CLICK_OTHER_EVENT", {
                lp_id: typeof page !== "undefined" ? page : "unknown",
                element_tag: tagName || "unknown",
                element_class: target.className || "unknown",
                first_touch_point: firstTouchPoint,
                last_touch_point: lastTouchPoint,
                timestamp: timestamp,
            });
            sendAnalyticsCall("LANDING_PAGE_CLICK_OTHER", {
                "Element Tag": tagName || "unknown",
                "Element Class": target.className || "unknown",
                "First Touch Point": firstTouchPoint,
                "Last Touch Point": lastTouchPoint,
                "LP Name": typeof page !== "undefined" ? page : "unknown",
                "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                "UTM Content": urlParams.get("utm_content") || "unknown",
                Device: device,
            });
        }
    });
    document.querySelectorAll(".store-link").forEach((btn) => {
        btn.addEventListener("click", () => {
            const store = btn.classList.contains("app-store") ? "App Store" : "Play Store";
            const deviceInfo = navigator.userAgent.toLowerCase();
            const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
            const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
            sendEventToBackend("APP_LISTING_VIEW_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", store, timestamp: timestamp });
            sendAnalyticsCall("APP_LISTING_VIEW", { "Store Name": store, Device: device });
        });
    });
    let ctaClickCount = parseInt(sessionStorage.getItem("ctaClickCount") || "0");
    document.querySelectorAll(".cta, .store-link").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            ctaClickCount++;
            sessionStorage.setItem("ctaClickCount", ctaClickCount);
            const deviceInfo = navigator.userAgent.toLowerCase();
            const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
            const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
            const target = e.target;
            const tagName = target.tagName?.toLowerCase();
            const extractTouchPoint = (el) => {
                if (!el) return "unknown";
                if (el.tagName?.toLowerCase() === "img" || el.tagName?.toLowerCase() === "video") {
                    const src = el.getAttribute("src") || el.currentSrc || el.getAttribute("href") || "";
                    return src ? src.split("/").pop() : "unknown";
                }
                return el.innerText?.trim()?.slice(0, 100) || el.getAttribute("alt") || el.getAttribute("aria-label") || "unknown";
            };
            if (firstTouchPoint === "scroll") {
                firstTouchPoint = extractTouchPoint(target);
            }
            lastTouchPoint = extractTouchPoint(target);
            const props = {
                "First Touch Point": firstTouchPoint,
                "Last Touch Point": lastTouchPoint,
                "CTA Text": btn.innerText?.trim(),
                "CTA Type": btn.classList.contains("store-link") ? "store" : "primary",
                "LP Name": typeof page !== "undefined" ? page : "unknown",
                "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                "UTM Content": urlParams.get("utm_content") || "unknown",
                Device: device,
            };
            if (ctaClickCount === 1) sendAnalyticsCall("1CTA_CLICK", props);
            else if (ctaClickCount === 2) sendAnalyticsCall("2CTA_CLICK", props);
            else if (ctaClickCount === 3) sendAnalyticsCall("3CTA_CLICK", props);
            sendAnalyticsCall("LANDING_PAGE_CLICK", { ...props });
        });
    });
    document.querySelectorAll("img, video").forEach((el) => {
        el.addEventListener("click", () => {
            const mediaType = el.tagName.toLowerCase() === "video" ? "video" : "static";
            const deviceInfo = navigator.userAgent.toLowerCase();
            const tagName = el.tagName.toLowerCase();
            const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
            const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
            const mediaTypes = tagName === "video" ? "video" : tagName === "img" ? "image" : "other";
            sendEventToBackend("MEDIA_INTERACTION_EVENT", {
                lp_id: typeof page !== "undefined" ? page : "unknown",
                action: `Interaction with Media: ${mediaType}`,
                element_id: (() => {
                    const src = el.currentSrc || el.src || "";
                    return src ? src.split("/").pop() : "unknown";
                })(),
                media_type: mediaTypes,
                timestamp: timestamp,
            });
            sendAnalyticsCall("MEDIA_INTERACTION", {
                "Element Id Name": (() => {
                    const src = el.currentSrc || el.src || "";
                    return src ? src.split("/").pop() : "unknown";
                })(),
                "Media Type": mediaTypes,
                "LP Name": typeof page !== "undefined" ? page : "unknown",
                "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                "UTM Content": urlParams.get("utm_content") || "unknown",
                Device: device,
            });
            lastTouchPoint = `media_${mediaType}`;
        });
    });
    let pageLoadTimestamp = Date.now();
    window.addEventListener("beforeunload", () => {
        const timeSpentSec = Math.round((Date.now() - pageLoadTimestamp) / 1000);
        const deviceInfo = navigator.userAgent.toLowerCase();
        const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
        const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
        sendEventToBackend("TIME_SPENT_ON_PAGE_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", time_spent_seconds: timeSpentSec, timestamp: timestamp });
        sendAnalyticsCall("TIME_SPENT_ON_PAGE", {
            "Time Spent in Seconds": timeSpentSec,
            "LP Name": typeof page !== "undefined" ? page : "unknown",
            "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
            "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
            "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
            "UTM Content": urlParams.get("utm_content") || "unknown",
            Device: device,
        });
    });
    let scrollFlags = { 25: !1, 50: !1, 75: !1, 100: !1 };
    window.addEventListener("scroll", () => {
        const percentScrolled = ((window.scrollY + window.innerHeight) / document.body.scrollHeight) * 100;
        [25, 50, 75, 100].forEach((p) => {
            if (percentScrolled >= p && !scrollFlags[p]) {
                scrollFlags[p] = !0;
                const deviceInfo = navigator.userAgent.toLowerCase();
                const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
                const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
                sendEventToBackend("SCROLL_DEPTH_REACHED_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", scroll_percent: p, timestamp: timestamp });
                sendAnalyticsCall("SCROLL_DEPTH_REACHED", {
                    "Scroll Percentage": p,
                    "LP Name": typeof page !== "undefined" ? page : "unknown",
                    "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                    "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                    "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                    "UTM Content": urlParams.get("utm_content") || "unknown",
                    Device: device,
                });
            }
        });
    });
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const hasAdParams = urlParams.get("utm_source");
        const deviceInfo = navigator.userAgent.toLowerCase();
        const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
        if (hasAdParams) {
            sendAnalyticsCall("AD_CLICK", {
                "LP Name": typeof page !== "undefined" ? page : "unknown",
                "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
                "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
                "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
                "UTM Content": urlParams.get("utm_content") || "unknown",
                Device: device,
            });
        }
    } catch (e) {
        console.error("AD_CLICK tracking error:", e);
    }
    function getLoadTimeInSeconds() {
        const navEntry = performance.getEntriesByType("navigation")[0];
        if (navEntry) {
            return (navEntry.loadEventEnd / 1000).toFixed(2);
        } else if (performance.timing) {
            const { navigationStart, loadEventEnd } = performance.timing;
            return loadEventEnd > 0 ? ((loadEventEnd - navigationStart) / 1000).toFixed(2) : null;
        }
        return null;
    }
    const deviceInfo = navigator.userAgent.toLowerCase();
    const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
    setTimeout(() => {
        const loadTime = getLoadTimeInSeconds();
        sendEventToBackend("LP_LOAD_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", load_time_seconds: loadTime !== null ? loadTime : "unavailable", device, timestamp: timestamp });
        sendAnalyticsCall("LP_LOAD", {
            "Load Time in Seconds": loadTime !== null ? loadTime : "unavailable",
            "LP Name": typeof page !== "undefined" ? page : "unknown",
            "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
            "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
            "UTM Campaign": urlParams.get("utm_campaign") || "unknown",
            "UTM Content": urlParams.get("utm_content") || "unknown",
            Device: device,
        });
    }, 0);
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("install_confirmed") === "1") {
        const deviceInfo = navigator.userAgent.toLowerCase();
        const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
        const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
        const target = e.target;
        const tagName = target.tagName?.toLowerCase();
        const extractTouchPoint = (el) => {
            if (!el) return "unknown";
            if (el.tagName?.toLowerCase() === "img" || el.tagName?.toLowerCase() === "video") {
                const src = el.getAttribute("src") || el.currentSrc || el.getAttribute("href") || "";
                return src ? src.split("/").pop() : "unknown";
            }
            return el.innerText?.trim()?.slice(0, 100) || el.getAttribute("alt") || el.getAttribute("aria-label") || "unknown";
        };
        if (firstTouchPoint === "scroll") {
            firstTouchPoint = extractTouchPoint(target);
        }
        lastTouchPoint = extractTouchPoint(target);
        sendEventToBackend("APP_INSTALL_CONFIRMED_EVENT", {
            lp_id: typeof page !== "undefined" ? page : "unknown",
            deeplink_used: urlParams.get("deeplink") || !1,
            first_touch_point: firstTouchPoint,
            last_touch_point: lastTouchPoint,
            timestamp: timestamp,
        });
        sendAnalyticsCall("APP_INSTALL_CONFIRMED", {
            "First Touch Point": firstTouchPoint,
            "Last Touch Point": lastTouchPoint,
            "LP Name": typeof page !== "undefined" ? page : "unknown",
            "UTM Adset Name": urlParams.get("utm_adset") || "unknown",
            "UTM Ad Name": urlParams.get("utm_ad") || "unknown",
            "Deeplink Used": urlParams.get("deeplink") || !1,
        });
    }
    const ctaMap = [
        { selector: ".cta", id: "get_started" },
        { selector: ".store-link.app-store", id: "app_store" },
        { selector: ".store-link.play-store", id: "play_store" },
    ];
    ctaMap.forEach(({ selector, id }) => {
        document.querySelectorAll(selector).forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const deviceInfo = navigator.userAgent.toLowerCase();
                const os = /android/.test(deviceInfo) ? "Android" : /iphone|ipad|ipod/.test(deviceInfo) ? "iOS" : "Other";
                const device = /mobile|android|iphone|ipad/.test(deviceInfo) ? "Mobile" : "Desktop";
                const text = btn.innerText.trim().slice(0, 100) || btn.getAttribute("aria-label") || btn.querySelector("img")?.getAttribute("alt") || "unknown";
                const target = e.target;
                const tagName = target.tagName?.toLowerCase();
                const extractTouchPoint = (el) => {
                    if (!el) return "unknown";
                    if (el.tagName?.toLowerCase() === "img" || el.tagName?.toLowerCase() === "video") {
                        const src = el.getAttribute("src") || el.currentSrc || el.getAttribute("href") || "";
                        return src ? src.split("/").pop() : "unknown";
                    }
                    return el.innerText?.trim()?.slice(0, 100) || el.getAttribute("alt") || el.getAttribute("aria-label") || "unknown";
                };
                if (firstTouchPoint === "scroll") {
                    firstTouchPoint = extractTouchPoint(target);
                }
                lastTouchPoint = extractTouchPoint(target);
                sendEventToBackend("CTA_CLICKED_EVENT", { lp_id: typeof page !== "undefined" ? page : "unknown", cta_text: text, first_touch_point: firstTouchPoint, last_touch_point: lastTouchPoint, timestamp: timestamp });
            });
        });
    });
});