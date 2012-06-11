Sequel.migration do
  up do
    create_table :records do
      primary_key :id
      Date :day, unique: true
      Text :data
    end
  end

  down do
    drop_table :records
  end
end
