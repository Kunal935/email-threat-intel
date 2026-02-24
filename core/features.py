import re 
import tldextract
import math
from collections import Counter

SUSPICIOUS_WORDS = [
    "urgent", "act now", "limited time", "verify account",
    "click here", "free money", "lottery", "winner",
    "crypto", "investment", "guaranteed"
]


def suspicious_keyword_score(text):
    if not text:
        return 0

    text_lower = text.lower()
    score = 0

    for word in SUSPICIOUS_WORDS:
        score += text_lower.count(word)

    return score / (len(text_lower.split()) + 1)


def capitalization_ratio(text):
    if not text:
        return 0
    
    total_c = len(text)
    upper_c = sum(1 for c in text if c.isupper())

    return upper_c/total_c



def exclamation_ratio(text):
    if not text:
        return 0
    
    return text.count("!")/len(text)



def url_risk_score(text):
    if not text:
        return 0
    
    urls = re.findall(r"https?://[^\s]+", text)
    score = 0

    for url in urls:
            # IP Based
        if re.match(r'https?://\d+\.\d+\.\d+\.\d+', url):
            score += 1

        #domain
        domain = tldextract.extract(url).domain
        if domain in ["bit" , "tinyurl"]:
            score += 1

        if len(url)>2:
            score += 1

    return score



def shannon_entropy(text):
    if not text:
        return 0

    freq = Counter(text)
    length = len(text)

    entropy = 0
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)

    return entropy


def extract_advanced_features(text):
    return {
        "Suspicious_Keyword_Score": suspicious_keyword_score(text),
        "Capitalization_Ratio": capitalization_ratio(text),
        "Exclamation_Ratio": exclamation_ratio(text),
        "URL_Risk_Score": url_risk_score(text),
        "Text_Entropy": shannon_entropy(text)
    }