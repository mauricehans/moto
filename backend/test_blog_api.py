
import requests
import json

BASE_URL = "http://127.0.0.1:8000/api/blog/"

def print_response(response):
    """Helper function to print response."""
    print(f"Status Code: {response.status_code}")
    try:
        print("Response JSON:")
        print(json.dumps(response.json(), indent=4))
    except json.JSONDecodeError:
        print("Response Text:")
        print(response.text)
    print("-" * 20)

def test_blog_api():
    """Tests the blog API."""

    # 1. Create a new category
    category_data = {
        "name": "Test Category",
        "slug": "test-category",
        "description": "A category for testing purposes."
    }
    print("Creating category...")
    response = requests.post(f"{BASE_URL}categories/", json=category_data)
    print_response(response)
    category_id = response.json()["id"]

    # 2. Create a new blog post
    post_data = {
        "title": "Test Post",
        "slug": "test-post",
        "category": category_id,
        "content": "This is a test post.",
        "is_published": True
    }
    print("Creating post...")
    response = requests.post(f"{BASE_URL}posts/", json=post_data)
    print_response(response)
    post_id = response.json()["id"]

    # 3. Retrieve the created post
    print(f"Retrieving post {post_id}...")
    response = requests.get(f"{BASE_URL}posts/{post_id}/")
    print_response(response)

    # 4. Update the post
    updated_post_data = {
        "title": "Updated Test Post",
        "content": "This is the updated content of the test post."
    }
    print(f"Updating post {post_id}...")
    response = requests.patch(f"{BASE_URL}posts/{post_id}/", json=updated_post_data)
    print_response(response)

    # 5. Delete the post
    print(f"Deleting post {post_id}...")
    response = requests.delete(f"{BASE_URL}posts/{post_id}/")
    print(f"Status Code: {response.status_code}")
    print("-" * 20)


    # 6. Delete the category
    print(f"Deleting category {category_id}...")
    response = requests.delete(f"{BASE_URL}categories/{category_id}/")
    print(f"Status Code: {response.status_code}")
    print("-" * 20)


if __name__ == "__main__":
    test_blog_api()
