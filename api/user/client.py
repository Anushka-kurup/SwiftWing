from fastapi import FastAPI
from fastapi import APIRouter, Depends, HTTPException
from dotenv import load_dotenv
from api.dependency import verify_client


load_dotenv()
app = FastAPI()

router = APIRouter()

@router.get("/client-only-endpoint")
def client_only_endpoint(client_verification_message: str = Depends(verify_client)):
    if client_verification_message == "Client verified":
        return True
    else:
        raise HTTPException(status_code=401, detail="Client not verified")

app.include_router(router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7000)
