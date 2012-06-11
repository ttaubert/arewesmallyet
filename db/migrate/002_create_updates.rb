Sequel.migration do
  up do
    create_table :updates do
      primary_key :id
      DateTime :finished
    end
  end

  down do
    drop_table :updates
  end
end
