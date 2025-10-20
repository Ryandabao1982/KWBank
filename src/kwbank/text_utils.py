"""
Advanced text processing utilities for keyword normalization and deduplication
"""
import re
import unicodedata
from typing import Set


class TextNormalizer:
    """Advanced text normalization for keywords"""
    
    # Common stop words that can be optionally removed
    STOP_WORDS = {
        'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for',
        'from', 'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on',
        'that', 'the', 'to', 'was', 'will', 'with'
    }
    
    @staticmethod
    def normalize_basic(text: str) -> str:
        """
        Basic normalization: lowercase, trim, collapse spaces
        (Maintains backward compatibility)
        """
        return " ".join(text.lower().strip().split())
    
    @staticmethod
    def remove_diacritics(text: str) -> str:
        """
        Remove diacritics/accents from text
        Example: 'café' -> 'cafe'
        """
        nfd = unicodedata.normalize('NFD', text)
        return ''.join(char for char in nfd if unicodedata.category(char) != 'Mn')
    
    @staticmethod
    def remove_punctuation(text: str, keep_spaces: bool = True) -> str:
        """
        Remove punctuation from text
        Optionally keeps spaces for word separation
        """
        if keep_spaces:
            # Replace punctuation with space, then normalize spaces
            text = re.sub(r'[^\w\s]', ' ', text)
            return ' '.join(text.split())
        else:
            return re.sub(r'[^\w\s]', '', text)
    
    @staticmethod
    def remove_stop_words(text: str, custom_stop_words: Set[str] = None) -> str:
        """
        Remove common stop words from text
        """
        stop_words = custom_stop_words if custom_stop_words else TextNormalizer.STOP_WORDS
        words = text.lower().split()
        filtered = [w for w in words if w not in stop_words]
        return ' '.join(filtered)
    
    @staticmethod
    def normalize_enhanced(
        text: str,
        remove_diacritics: bool = True,
        remove_punctuation: bool = True,
        remove_stop_words: bool = False,
        custom_stop_words: Set[str] = None
    ) -> str:
        """
        Enhanced normalization with multiple options
        
        Args:
            text: Input text to normalize
            remove_diacritics: Remove accents and diacritics
            remove_punctuation: Remove punctuation marks
            remove_stop_words: Remove common stop words
            custom_stop_words: Custom set of stop words to use
        
        Returns:
            Normalized text
        """
        # Start with basic normalization
        result = text.lower().strip()
        
        # Remove diacritics
        if remove_diacritics:
            result = TextNormalizer.remove_diacritics(result)
        
        # Remove punctuation
        if remove_punctuation:
            result = TextNormalizer.remove_punctuation(result)
        
        # Remove stop words
        if remove_stop_words:
            result = TextNormalizer.remove_stop_words(result, custom_stop_words)
        
        # Final space normalization
        return ' '.join(result.split())
    
    @staticmethod
    def stem_simple(word: str) -> str:
        """
        Simple stemming algorithm (removes common suffixes)
        This is a lightweight alternative to Porter Stemmer
        """
        # Common suffix rules (simplified)
        suffixes = ['ing', 'ed', 'es', 's', 'ly', 'er', 'est']
        
        word = word.lower()
        
        # Try to remove suffixes (longest first)
        for suffix in suffixes:
            if word.endswith(suffix) and len(word) > len(suffix) + 2:
                return word[:-len(suffix)]
        
        return word
    
    @staticmethod
    def stem_text(text: str) -> str:
        """
        Apply simple stemming to all words in text
        Example: 'running shoes' -> 'run shoe'
        """
        words = text.lower().split()
        stemmed = [TextNormalizer.stem_simple(w) for w in words]
        return ' '.join(stemmed)


class SimilarityChecker:
    """Text similarity checking for fuzzy deduplication"""
    
    @staticmethod
    def levenshtein_distance(s1: str, s2: str) -> int:
        """
        Calculate Levenshtein (edit) distance between two strings
        """
        if len(s1) < len(s2):
            return SimilarityChecker.levenshtein_distance(s2, s1)
        
        if len(s2) == 0:
            return len(s1)
        
        previous_row = range(len(s2) + 1)
        for i, c1 in enumerate(s1):
            current_row = [i + 1]
            for j, c2 in enumerate(s2):
                # Cost of insertions, deletions, or substitutions
                insertions = previous_row[j + 1] + 1
                deletions = current_row[j] + 1
                substitutions = previous_row[j] + (c1 != c2)
                current_row.append(min(insertions, deletions, substitutions))
            previous_row = current_row
        
        return previous_row[-1]
    
    @staticmethod
    def similarity_ratio(s1: str, s2: str) -> float:
        """
        Calculate similarity ratio between two strings (0.0 to 1.0)
        Based on Levenshtein distance
        """
        distance = SimilarityChecker.levenshtein_distance(s1, s2)
        max_len = max(len(s1), len(s2))
        
        if max_len == 0:
            return 1.0
        
        return 1.0 - (distance / max_len)
    
    @staticmethod
    def jaro_winkler_similarity(s1: str, s2: str) -> float:
        """
        Calculate Jaro-Winkler similarity between two strings
        Returns value between 0.0 (no similarity) and 1.0 (identical)
        """
        # Jaro similarity
        if s1 == s2:
            return 1.0
        
        len1, len2 = len(s1), len(s2)
        
        if len1 == 0 or len2 == 0:
            return 0.0
        
        max_dist = max(len1, len2) // 2 - 1
        matches = 0
        hash_s1 = [0] * len1
        hash_s2 = [0] * len2
        
        for i in range(len1):
            start = max(0, i - max_dist)
            end = min(i + max_dist + 1, len2)
            
            for j in range(start, end):
                if hash_s2[j] or s1[i] != s2[j]:
                    continue
                hash_s1[i] = 1
                hash_s2[j] = 1
                matches += 1
                break
        
        if matches == 0:
            return 0.0
        
        # Count transpositions
        t = 0
        point = 0
        for i in range(len1):
            if hash_s1[i]:
                while not hash_s2[point]:
                    point += 1
                if s1[i] != s2[point]:
                    t += 1
                point += 1
        
        t = t // 2
        
        jaro = (matches / len1 + matches / len2 + (matches - t) / matches) / 3.0
        
        # Jaro-Winkler modification
        prefix = 0
        for i in range(min(len1, len2)):
            if s1[i] == s2[i]:
                prefix += 1
            else:
                break
        
        prefix = min(4, prefix)
        
        return jaro + (prefix * 0.1 * (1.0 - jaro))
    
    @staticmethod
    def are_fuzzy_duplicates(s1: str, s2: str, threshold: float = 0.92) -> bool:
        """
        Check if two strings are fuzzy duplicates
        Uses Jaro-Winkler similarity with default threshold of 0.92
        """
        similarity = SimilarityChecker.jaro_winkler_similarity(s1, s2)
        return similarity >= threshold


class IntentDetector:
    """Simple intent detection for keywords"""
    
    # Intent indicators (keywords that suggest intent)
    AWARENESS_INDICATORS = {
        'what is', 'how to', 'guide', 'tips', 'learn', 'tutorial',
        'best', 'top', 'review', 'compare', 'vs', 'versus'
    }
    
    CONSIDERATION_INDICATORS = {
        'compare', 'vs', 'versus', 'review', 'reviews', 'rating',
        'best', 'top', 'cheap', 'affordable', 'discount', 'deal'
    }
    
    CONVERSION_INDICATORS = {
        'buy', 'purchase', 'shop', 'order', 'sale', 'price',
        'discount', 'deal', 'coupon', 'shipping', 'delivery',
        'where to buy', 'online', 'store'
    }
    
    @staticmethod
    def detect_intent(text: str) -> str:
        """
        Detect intent from keyword text
        Returns: 'awareness', 'consideration', 'conversion', or 'unknown'
        """
        text_lower = text.lower()
        
        # Count matches for each intent
        awareness_count = sum(1 for indicator in IntentDetector.AWARENESS_INDICATORS 
                             if indicator in text_lower)
        consideration_count = sum(1 for indicator in IntentDetector.CONSIDERATION_INDICATORS 
                                 if indicator in text_lower)
        conversion_count = sum(1 for indicator in IntentDetector.CONVERSION_INDICATORS 
                              if indicator in text_lower)
        
        # Return intent with highest count
        max_count = max(awareness_count, consideration_count, conversion_count)
        
        if max_count == 0:
            return 'unknown'
        
        if conversion_count == max_count:
            return 'conversion'
        elif consideration_count == max_count:
            return 'consideration'
        else:
            return 'awareness'
    
    @staticmethod
    def suggest_bid_multiplier(intent: str) -> float:
        """
        Suggest a bid multiplier based on intent
        Conversion keywords typically warrant higher bids
        """
        multipliers = {
            'conversion': 1.5,
            'consideration': 1.2,
            'awareness': 1.0,
            'unknown': 1.0
        }
        return multipliers.get(intent, 1.0)
