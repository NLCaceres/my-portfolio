#* Simple assertions related to common situations for Rails models
module ModelAssertions
  # @params: expected_db_val - Since Rails enums map the key/symbol to ints, the DB stores ints (not readable strings)
  # @params: enum_map - Rails provides enables enums which create a convenient mapper that's basically a ruby hash
  def enum_asserter(expected_db_val, enum_map, enum_symbol)
    enum_key = enum_symbol.to_s
    assert_equal_cases(expected_db_val, enum_map, enum_symbol, enum_key)

    if (underscore_index = enum_key.index('_')) #? Returns index # or nil if no underscore found
      underscore_camel_version = enum_key[0..underscore_index] + enum_key[underscore_index + 1..].capitalize
      camelcase_version = underscore_camel_version.delete '_' #? Could also tr('_', '')
      downcase_version = camelcase_version.downcase
      assert_nil_other_cases(enum_map, underscore_camel_version, camelcase_version, downcase_version)

    elsif (downcase_version = enum_key.downcase) != enum_key
      #* Converts iOS -> ios ONLY if it's not already all lowercase
      assert_nil enum_map[downcase_version], "param string: '#{downcase_version}' unexpectedly DID associate"
    end
  end

  private

  #* Checking that expected enum_key / enum_symbol work
  def assert_equal_cases(expected_db_val, enum_map, *different_keys)
    different_keys.each do |this_case|
      assert_equal expected_db_val, enum_map[this_case], "param string: '#{this_case}' did not associate as expected"
    end
  end

  #* Common Cases: underscore_Camel: back_end -> back_End, camelCase: back_End -> backEnd, downcase: backEnd -> backend
  def assert_nil_other_cases(enum_map, *different_cases)
    different_cases.each do |this_case|
      assert_nil enum_map[this_case], "param string: '#{this_case}' unexpectedly DID associate"
    end
  end
end
