# require "application_system_test_case"

# class AdminUsersTest < ApplicationSystemTestCase
#   setup do
#     @admin_user = admin_users(:one)
#   end

#   test "visiting the index" do
#     visit admin_users_url
#     assert_selector "h1", text: "Admin Users"
#   end

#   test "creating a Admin user" do
#     visit admin_users_url
#     click_on "New Admin User"

#     click_on "Create Admin user"

#     assert_text "Admin user was successfully created"
#     click_on "Back"
#   end

#   test "updating a Admin user" do
#     visit admin_users_url
#     click_on "Edit", match: :first

#     click_on "Update Admin user"

#     assert_text "Admin user was successfully updated"
#     click_on "Back"
#   end

#   test "destroying a Admin user" do
#     visit admin_users_url
#     page.accept_confirm do
#       click_on "Destroy", match: :first
#     end

#     assert_text "Admin user was successfully destroyed"
#   end
# end
