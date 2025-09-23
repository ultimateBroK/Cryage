import pinecone
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Any, Optional
import os
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)

class VectorDatabase:
    """Vector database integration for trading knowledge storage and retrieval."""
    
    def __init__(self, api_key: Optional[str] = None, environment: str = "us-west1-gcp"):
        """
        Initialize vector database.
        
        Args:
            api_key: Pinecone API key
            environment: Pinecone environment
        """
        self.api_key = api_key or os.getenv("PINECONE_API_KEY")
        self.environment = environment
        self.index_name = "trading-knowledge"
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = None
        
        if self.api_key:
            self._initialize_pinecone()
        else:
            logger.warning("Pinecone API key not found. Vector database features will be limited.")
    
    def _initialize_pinecone(self):
        """Initialize Pinecone connection."""
        try:
            pinecone.init(api_key=self.api_key, environment=self.environment)
            
            # Create index if it doesn't exist
            if self.index_name not in pinecone.list_indexes():
                pinecone.create_index(
                    name=self.index_name,
                    dimension=384,  # all-MiniLM-L6-v2 dimension
                    metric="cosine"
                )
                logger.info(f"Created Pinecone index: {self.index_name}")
            
            self.index = pinecone.Index(self.index_name)
            logger.info("Pinecone initialized successfully")
            
        except Exception as e:
            logger.error(f"Failed to initialize Pinecone: {e}")
            self.index = None
    
    def insert_knowledge(self, texts: List[str], metadata: Optional[List[Dict[str, Any]]] = None) -> bool:
        """
        Insert knowledge texts into vector database.
        
        Args:
            texts: List of text documents
            metadata: Optional metadata for each text
            
        Returns:
            Success status
        """
        if not self.index:
            logger.error("Pinecone not initialized")
            return False
        
        try:
            # Generate embeddings
            embeddings = self.embedder.encode(texts).tolist()
            
            # Prepare vectors for upsert
            vectors = []
            for i, (text, embedding) in enumerate(zip(texts, embeddings)):
                vector_id = f"doc_{int(datetime.now().timestamp())}_{i}"
                
                meta = {
                    "text": text,
                    "timestamp": datetime.now().isoformat(),
                    "type": "trading_knowledge"
                }
                
                if metadata and i < len(metadata):
                    meta.update(metadata[i])
                
                vectors.append((vector_id, embedding, meta))
            
            # Upsert to Pinecone
            self.index.upsert(vectors=vectors)
            logger.info(f"Inserted {len(texts)} knowledge items")
            return True
            
        except Exception as e:
            logger.error(f"Failed to insert knowledge: {e}")
            return False
    
    def query_knowledge(self, text_query: str, top_k: int = 5, filter_dict: Optional[Dict] = None) -> List[Dict[str, Any]]:
        """
        Query knowledge from vector database.
        
        Args:
            text_query: Query text
            top_k: Number of results to return
            filter_dict: Optional filter for metadata
            
        Returns:
            List of matching results
        """
        if not self.index:
            logger.error("Pinecone not initialized")
            return []
        
        try:
            # Generate query embedding
            query_embedding = self.embedder.encode([text_query]).tolist()[0]
            
            # Query Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                include_metadata=True,
                filter=filter_dict
            )
            
            # Format results
            formatted_results = []
            for match in results['matches']:
                formatted_results.append({
                    "id": match['id'],
                    "score": match['score'],
                    "text": match['metadata'].get('text', ''),
                    "metadata": match['metadata']
                })
            
            logger.info(f"Retrieved {len(formatted_results)} knowledge items")
            return formatted_results
            
        except Exception as e:
            logger.error(f"Failed to query knowledge: {e}")
            return []
    
    def insert_trading_signal(self, signal_data: Dict[str, Any]) -> bool:
        """
        Insert trading signal into vector database.
        
        Args:
            signal_data: Trading signal data
            
        Returns:
            Success status
        """
        signal_text = f"""
        Trading Signal: {signal_data.get('signal', 'N/A')}
        Symbol: {signal_data.get('symbol', 'N/A')}
        Entry: {signal_data.get('entry', 'N/A')}
        Stop Loss: {signal_data.get('stop_loss', 'N/A')}
        Take Profit: {signal_data.get('take_profit', 'N/A')}
        Reasoning: {signal_data.get('reasoning', 'N/A')}
        """
        
        metadata = {
            "type": "trading_signal",
            "signal": signal_data.get('signal', ''),
            "symbol": signal_data.get('symbol', ''),
            "timestamp": signal_data.get('timestamp', datetime.now().isoformat())
        }
        
        return self.insert_knowledge([signal_text], [metadata])
    
    def insert_market_analysis(self, analysis_data: Dict[str, Any]) -> bool:
        """
        Insert market analysis into vector database.
        
        Args:
            analysis_data: Market analysis data
            
        Returns:
            Success status
        """
        analysis_text = f"""
        Market Analysis: {analysis_data.get('title', 'N/A')}
        Summary: {analysis_data.get('summary', 'N/A')}
        Technical Indicators: {analysis_data.get('indicators', 'N/A')}
        Market Sentiment: {analysis_data.get('sentiment', 'N/A')}
        Key Levels: {analysis_data.get('key_levels', 'N/A')}
        """
        
        metadata = {
            "type": "market_analysis",
            "symbol": analysis_data.get('symbol', ''),
            "timestamp": analysis_data.get('timestamp', datetime.now().isoformat())
        }
        
        return self.insert_knowledge([analysis_text], [metadata])
    
    def search_similar_signals(self, query: str, symbol: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar trading signals.
        
        Args:
            query: Search query
            symbol: Optional symbol filter
            top_k: Number of results
            
        Returns:
            List of similar signals
        """
        filter_dict = {"type": "trading_signal"}
        if symbol:
            filter_dict["symbol"] = symbol
        
        return self.query_knowledge(query, top_k, filter_dict)
    
    def search_market_analysis(self, query: str, symbol: Optional[str] = None, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Search for market analysis.
        
        Args:
            query: Search query
            symbol: Optional symbol filter
            top_k: Number of results
            
        Returns:
            List of market analysis
        """
        filter_dict = {"type": "market_analysis"}
        if symbol:
            filter_dict["symbol"] = symbol
        
        return self.query_knowledge(query, top_k, filter_dict)
    
    def get_relevant_context(self, query: str, context_type: str = "all", top_k: int = 3) -> str:
        """
        Get relevant context for a query.
        
        Args:
            query: Query text
            context_type: Type of context (all, signals, analysis)
            top_k: Number of results
            
        Returns:
            Formatted context string
        """
        if context_type == "signals":
            results = self.search_similar_signals(query, top_k=top_k)
        elif context_type == "analysis":
            results = self.search_market_analysis(query, top_k=top_k)
        else:
            results = self.query_knowledge(query, top_k=top_k)
        
        if not results:
            return "No relevant context found."
        
        context_parts = []
        for result in results:
            context_parts.append(f"Relevant Knowledge: {result['text']}")
        
        return "\n\n".join(context_parts)
    
    def delete_knowledge(self, vector_ids: List[str]) -> bool:
        """
        Delete knowledge by vector IDs.
        
        Args:
            vector_ids: List of vector IDs to delete
            
        Returns:
            Success status
        """
        if not self.index:
            logger.error("Pinecone not initialized")
            return False
        
        try:
            self.index.delete(ids=vector_ids)
            logger.info(f"Deleted {len(vector_ids)} knowledge items")
            return True
        except Exception as e:
            logger.error(f"Failed to delete knowledge: {e}")
            return False
    
    def get_index_stats(self) -> Dict[str, Any]:
        """Get index statistics."""
        if not self.index:
            return {"error": "Pinecone not initialized"}
        
        try:
            stats = self.index.describe_index_stats()
            return {
                "total_vectors": stats.get('total_vector_count', 0),
                "dimension": stats.get('dimension', 0),
                "index_fullness": stats.get('index_fullness', 0)
            }
        except Exception as e:
            logger.error(f"Failed to get index stats: {e}")
            return {"error": str(e)}

# Global instance
vector_db = VectorDatabase()

# Convenience functions
def insert_trading_knowledge(texts: List[str], metadata: Optional[List[Dict[str, Any]]] = None) -> bool:
    """Insert trading knowledge into vector database."""
    return vector_db.insert_knowledge(texts, metadata)

def query_trading_knowledge(query: str, top_k: int = 5) -> List[Dict[str, Any]]:
    """Query trading knowledge from vector database."""
    return vector_db.query_knowledge(query, top_k)

def get_trading_context(query: str, context_type: str = "all", top_k: int = 3) -> str:
    """Get relevant trading context for a query."""
    return vector_db.get_relevant_context(query, context_type, top_k)
