from db.session import get_db
from sqlalchemy.orm import Session
from models.models import Conversation

from fastapi import APIRouter, Depends, HTTPException

from src.auth import get_current_user
from models.models import User
from services.generator import Generator
from pydantic import BaseModel
import logging

router = APIRouter()
generator = Generator()
logger = logging.getLogger(__name__)

class GenerateRequest(BaseModel):
    prompt: str

class UpdateConversation(BaseModel):
    title: str = None
    is_archived: bool = None

@router.post("/")
def generate_conversation_from_prompt(
    request: GenerateRequest,
    db: Session = Depends(get_db),
    curr_user: User = Depends(get_current_user)
):
    if not request.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")
    try:
        result = generator.generate(request.prompt, db.connection())

        try:
            new_conv = Conversation(user_id=curr_user.id, **result)

            db.add(new_conv)
            db.commit()
        except Exception as e:
            logger.error(f"Error saving conversation: {e}")
            result["error"] = "Error occures while saving conversation."

        return result
    except Exception as e:
        logger.error(f"Error generating response: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/")
def get_conversations(
    db: Session = Depends(get_db),
    curr_user: User = Depends(get_current_user)
):
    results = db.query(
        Conversation.id,
        Conversation.title,
        Conversation.created_at
    ).filter(
        Conversation.user_id == curr_user.id,
        Conversation.is_archived == False
    ).order_by(Conversation.created_at.desc()).all()

    # Convert to dictionaries
    dict_results = [row._asdict() for row in results]
    return dict_results

@router.get("/{conversation_id}")
def get_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    curr_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == curr_user.id).first()
    if conversation is None:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.patch("/{conversation_id}")
def update_conversation(
    conversation_id: str,
    update_data: UpdateConversation,
    db: Session = Depends(get_db),
    curr_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == curr_user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if update_data.title is not None:
        conversation.title = update_data.title
    if update_data.is_archived is not None:
        conversation.is_archived = update_data.is_archived
    
    db.commit()
    db.refresh(conversation)
    return conversation

@router.delete("/{conversation_id}")
def delete_conversation(
    conversation_id: str,
    db: Session = Depends(get_db),
    curr_user: User = Depends(get_current_user)
):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id, Conversation.user_id == curr_user.id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    db.delete(conversation)
    db.commit()
    return {"message": "Conversation deleted successfully"}
