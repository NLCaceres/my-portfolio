#* Common Headers for sending with requests in tests
module CommonHeaders
  def accept_header(value = 'application/json') 
    { 'ACCEPT' => value } #* Use most useful value (application/json) as default arg
  end
end
